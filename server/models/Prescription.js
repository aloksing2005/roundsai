const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, default: '' },
  duration: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  visitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit',
    required: true
  },
  medications: {
    type: [medicationSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'At least one medication is required'
    }
  },
  pdfGeneratedAt: {
    type: Date
  }
}, { timestamps: true });

prescriptionSchema.index({ patientId: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);