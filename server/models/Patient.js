const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  allergies: {
    type: [String],
    default: []
  },
  chronicConditions: {
    type: [String],
    default: []
  },
  currentMedications: {
    type: [String],
    default: []
  }
}, { timestamps: true });

patientSchema.index({ name: 1 });

module.exports = mongoose.model('Patient', patientSchema);