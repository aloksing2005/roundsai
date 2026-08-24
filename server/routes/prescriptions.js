const express = require('express');
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');
const Doctor = require('../models/Doctor');
const requireAuth = require('../middleware/requireAuth');
const generatePrescriptionPDF = require('../services/generatePrescriptionPDF');

const router = express.Router();

router.use(requireAuth);

function validateMedications(medications) {
  if (!Array.isArray(medications) || medications.length === 0) {
    return 'At least one medication with a name and dosage is required';
  }
  for (const med of medications) {
    if (!med.name || !med.name.trim() || !med.dosage || !med.dosage.trim()) {
      return 'Each medication requires at least a name and dosage';
    }
  }
  return null;
}

// POST /api/prescriptions
router.post('/', async (req, res) => {
  const { patientId, visitId, medications } = req.body;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ error: 'A valid patientId is required' });
  }
  if (!mongoose.Types.ObjectId.isValid(visitId)) {
    return res.status(400).json({ error: 'A valid visitId is required' });
  }

  const validationError = validateMedications(medications);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const visit = await Visit.findById(visitId);
    if (!visit || visit.patientId.toString() !== patientId) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const cleanMeds = medications.map(m => ({
      name: m.name.trim(),
      dosage: m.dosage.trim(),
      frequency: (m.frequency || '').trim(),
      duration: (m.duration || '').trim(),
      notes: (m.notes || '').trim()
    }));

    const prescription = await Prescription.create({
      patientId,
      visitId,
      medications: cleanMeds
    });

    visit.medicationsPrescribed = cleanMeds.map(m => `${m.name} ${m.dosage}`);
    await visit.save();

    res.status(201).json(prescription);
  } catch (err) {
    console.error('Create prescription error:', err);
    res.status(400).json({ error: 'Could not create prescription. Please check your input.' });
  }
});

// GET /api/prescriptions/by-patient/:id
router.get('/by-patient/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  try {
    const prescriptions = await Prescription.find({ patientId: id }).sort({ createdAt: -1 });
    res.status(200).json(prescriptions);
  } catch (err) {
    console.error('List prescriptions error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// GET /api/prescriptions/:id/pdf
router.get('/:id/pdf', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid prescription ID' });
  }

  try {
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const patient = await Patient.findById(prescription.patientId);
    const doctor = await Doctor.findOne();

    const pdfBytes = await generatePrescriptionPDF(prescription, patient, doctor);

    if (!prescription.pdfGeneratedAt) {
      prescription.pdfGeneratedAt = new Date();
      await prescription.save();
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="prescription-${patient.name.replace(/\s+/g, '-')}-${id}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Could not generate PDF.' });
  }
});

module.exports = router;