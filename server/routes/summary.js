const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');
const IntakeForm = require('../models/IntakeForm');
const requireAuth = require('../middleware/requireAuth');
const { getPatientSummary } = require('../services/aiSummary');

const router = express.Router();

router.use(requireAuth);

// POST /api/patients/:id/summary
router.post('/:id/summary', async (req, res) => {
  const { id } = req.params;
  const { visitId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }
  if (!visitId || !mongoose.Types.ObjectId.isValid(visitId)) {
    return res.status(400).json({ error: 'A valid visitId is required' });
  }

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const visit = await Visit.findById(visitId);
    if (!visit || visit.patientId.toString() !== id) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const intakeForm = await IntakeForm.findOne({ patientId: id }).sort({ submittedAt: -1 });
    const pastVisits = await Visit.find({ patientId: id, status: 'done' }).sort({ date: -1 }).limit(3);

    const { text, source } = await getPatientSummary(patient, intakeForm, pastVisits);

    visit.summaryGenerated = {
      text,
      source,
      generatedAt: new Date()
    };
    await visit.save();

    res.status(200).json({ text, source, generatedAt: visit.summaryGenerated.generatedAt });
  } catch (err) {
    console.error('Summary generation error:', err);
    res.status(500).json({ error: 'Something went wrong generating the summary.' });
  }
});

module.exports = router;