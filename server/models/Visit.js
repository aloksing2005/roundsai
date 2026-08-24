const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  reasonForVisit: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'done'],
    default: 'waiting'
  },
  diagnosisNotes: {
    type: String,
    default: ''
  },
  medicationsPrescribed: {
    type: [String],
    default: []
  },
  summaryGenerated: {
    text: { type: String },
    source: { type: String, enum: ['claude', 'fallback'] },
    generatedAt: { type: Date }
  }
}, { timestamps: true });

visitSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Visit', visitSchema);