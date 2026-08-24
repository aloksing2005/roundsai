require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');

// --- Startup environment validation ---
const REQUIRED_ENV_VARS = ['MONGODB_URI', 'JWT_SECRET'];

const missingVars = REQUIRED_ENV_VARS.filter(
  key => !process.env[key] || process.env[key].trim() === ''
);

if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variable(s): ${missingVars.join(', ')}`
  );
  console.error(
    '   Check your environment variables before starting the server.'
  );
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const visitRoutes = require('./routes/visits');
const summaryRoutes = require('./routes/summary');
const prescriptionRoutes = require('./routes/prescriptions');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins.
// Keep localhost for development and allow the deployed frontend when configured.
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
}

// Security + performance middleware
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

app.use(compression());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'RoundsAI API is running'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/patients', summaryRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// API 404
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'Origin not allowed'
    });
  }

  res.status(500).json({
    error: 'Something went wrong on our end. Please try again.'
  });
});

// Connect to MongoDB, then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', reason => {
  console.error('Unhandled promise rejection:', reason);
});