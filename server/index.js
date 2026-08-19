require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // our Vite frontend's local address
  credentials: true                 // allows cookies to be sent cross-origin
}));
app.use(express.json());
app.use(cookieParser());

// Health check route — confirms the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoundsAI API is running' });
});

// Connect to MongoDB, then start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });