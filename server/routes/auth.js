const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const Doctor = require('../models/Doctor');
const requireAuth = require('../middleware/requireAuth');
const { isNonEmptyString } = require('../utils/validators');

const router = express.Router();

function getCookieOptions(req) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecureReq = req && (req.secure || req.headers['x-forwarded-proto'] === 'https');
  const useSecure = isProduction || isSecureReq;

  return {
    httpOnly: true,
    secure: useSecure,
    sameSite: useSecure ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  };
}

function getClearCookieOptions(req) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecureReq = req && (req.secure || req.headers['x-forwarded-proto'] === 'https');
  const useSecure = isProduction || isSecureReq;

  return {
    httpOnly: true,
    secure: useSecure,
    sameSite: useSecure ? 'none' : 'lax',
    path: '/'
  };
}

// Limit login attempts to slow brute-force attacks.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please try again in a few minutes.'
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  try {
    const doctor = await Doctor.findOne({
      email: email.toLowerCase().trim()
    }).select('+passwordHash');

    if (!doctor) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      doctor.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: doctor._id,
        email: doctor.email,
        name: doctor.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.cookie('token', token, getCookieOptions(req));

    return res.status(200).json({
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({
      error: 'Something went wrong. Please try again.'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', getClearCookieOptions(req));

  return res.status(200).json({
    message: 'Logged out'
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);

    if (!doctor) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    return res.status(200).json({
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email
      }
    });
  } catch (err) {
    console.error('Session check error:', err);

    return res.status(500).json({
      error: 'Something went wrong.'
    });
  }
});

module.exports = router;