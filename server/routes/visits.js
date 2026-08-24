const express = require('express');
const mongoose = require('mongoose');
const Visit = require('../models/Visit');
const Patient = require('../models/Patient');
const requireAuth = require('../middleware/requireAuth');
const { isNonEmptyString } = require('../utils/validators');

const router = express.Router();

router.use(requireAuth);

const STATUS_ORDER = ['waiting', 'in-progress', 'done'];

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// GET /api/visits/today
router.get('/today', async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    const visits = await Visit.find({
      date: {
        $gte: start,
        $lte: end
      }
    })
      .populate('patientId', 'name')
      .sort({ date: 1 });

    res.status(200).json(visits);
  } catch (err) {
    console.error('Get today visits error:', err);

    res.status(500).json({
      error: 'Something went wrong.'
    });
  }
});

// POST /api/visits
// Creates today's visit or returns the existing one.
// This prevents duplicate visits for the same patient on the same day.
router.post('/', async (req, res) => {
  const { patientId, reasonForVisit } = req.body;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({
      error: 'A valid patientId is required'
    });
  }

  if (
    reasonForVisit !== undefined &&
    !isNonEmptyString(reasonForVisit)
  ) {
    return res.status(400).json({
      error:
        'Reason for visit must be a non-empty string if provided'
    });
  }

  try {
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    const { start, end } = getTodayRange();

    const existing = await Visit.findOne({
      patientId,
      date: {
        $gte: start,
        $lte: end
      }
    }).populate('patientId', 'name');

    if (existing) {
      return res.status(200).json(existing);
    }

    const visit = await Visit.create({
      patientId,
      date: new Date(),
      reasonForVisit: reasonForVisit
        ? reasonForVisit.trim()
        : '',
      status: 'waiting'
    });

    const populated = await visit.populate(
      'patientId',
      'name'
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error('Create visit error:', err);

    res.status(500).json({
      error: 'Something went wrong.'
    });
  }
});

// PATCH /api/visits/:id/status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid visit ID'
    });
  }

  if (!STATUS_ORDER.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status value'
    });
  }

  try {
    const visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    const currentIndex = STATUS_ORDER.indexOf(
      visit.status
    );

    const newIndex = STATUS_ORDER.indexOf(status);

    if (newIndex <= currentIndex) {
      return res.status(400).json({
        error:
          'Status can only move forward (Waiting → In Progress → Done)'
      });
    }

    visit.status = status;
    await visit.save();

    const populated = await visit.populate(
      'patientId',
      'name'
    );

    res.status(200).json(populated);
  } catch (err) {
    console.error('Update visit status error:', err);

    res.status(500).json({
      error: 'Something went wrong.'
    });
  }
});

module.exports = router;