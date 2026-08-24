const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');
const requireAuth = require('../middleware/requireAuth');
const { isNonEmptyString, isValidStringArray } = require('../utils/validators');

const router = express.Router();

router.use(requireAuth);

// GET /api/patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ name: 1 });
    res.status(200).json(patients);
  } catch (err) {
    console.error('List patients error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const visits = await Visit.find({ patientId: id }).sort({ date: -1 });

    res.status(200).json({ ...patient.toObject(), visits });
  } catch (err) {
    console.error('Get patient error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// POST /api/patients
router.post('/', async (req, res) => {
  const { name, dob, gender, allergies, chronicConditions, currentMedications } = req.body;

  if (!isNonEmptyString(name) || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name is required (min 2 characters)' });
  }
  if (!dob || isNaN(new Date(dob).getTime())) {
    return res.status(400).json({ error: 'A valid date of birth is required' });
  }
  if (new Date(dob).getTime() > Date.now()) {
    return res.status(400).json({ error: 'Date of birth cannot be in the future' });
  }
  if (!['male', 'female', 'other'].includes(gender)) {
    return res.status(400).json({ error: 'Please select a valid gender' });
  }
  if (!isValidStringArray(allergies) || !isValidStringArray(chronicConditions) || !isValidStringArray(currentMedications)) {
    return res.status(400).json({ error: 'Allergies, conditions, and medications must be lists of text values' });
  }

  try {
    const patient = await Patient.create({
      name: name.trim(),
      dob,
      gender,
      allergies: allergies || [],
      chronicConditions: chronicConditions || [],
      currentMedications: currentMedications || []
    });
    res.status(201).json(patient);
  } catch (err) {
    console.error('Create patient error:', err);
    res.status(400).json({ error: 'Could not create patient. Please check your input.' });
  }
});

// PUT /api/patients/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { name, dob, gender, allergies, chronicConditions, currentMedications } = req.body;

  if (name !== undefined && (!isNonEmptyString(name) || name.trim().length < 2)) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (dob !== undefined && (isNaN(new Date(dob).getTime()) || new Date(dob).getTime() > Date.now())) {
    return res.status(400).json({ error: 'Please provide a valid date of birth (not in the future)' });
  }
  if (gender !== undefined && !['male', 'female', 'other'].includes(gender)) {
    return res.status(400).json({ error: 'Please select a valid gender' });
  }
  if (!isValidStringArray(allergies) || !isValidStringArray(chronicConditions) || !isValidStringArray(currentMedications)) {
    return res.status(400).json({ error: 'Allergies, conditions, and medications must be lists of text values' });
  }

  try {
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (dob !== undefined) updates.dob = dob;
    if (gender !== undefined) updates.gender = gender;
    if (allergies !== undefined) updates.allergies = allergies;
    if (chronicConditions !== undefined) updates.chronicConditions = chronicConditions;
    if (currentMedications !== undefined) updates.currentMedications = currentMedications;

    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!patient) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(patient);
  } catch (err) {
    console.error('Update patient error:', err);
    res.status(400).json({ error: 'Could not update patient. Please check your input.' });
  }
});

module.exports = router;