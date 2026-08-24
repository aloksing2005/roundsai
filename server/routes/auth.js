const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const Doctor = require('../models/Doctor');
const requireAuth = require('../middleware/requireAuth');
const { isNonEmptyString } = require('../utils/validators');

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000
};

// Limit login attempts to slow brute-force attacks: 10 attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in a few minutes.' }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // Strict type validation — prevents NoSQL injection via object payloads like { "$ne": null }
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

    if (!doctor) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, doctor.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, name: doctor.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);
    if (!doctor) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json({
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email }
    });
  } catch (err) {
    console.error('Session check error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;