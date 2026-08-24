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
    '   Check your server/.env file before starting the server.'
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

// Security + performance middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(compression());

// Allow local development and the deployed frontend.
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // (health checks, server-to-server requests, etc.).
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
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

// 404 handler for unknown API routes
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
      error: 'CORS origin not allowed'
    });
  }

  res.status(500).json({
    error: 'Something went wrong on our end. Please try again.'
  });
});

// Connect to MongoDB, then start the server
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