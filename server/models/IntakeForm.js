const mongoose = require('mongoose');

const intakeFormSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  reasonForVisit: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

intakeFormSchema.index({ patientId: 1 });

module.exports = mongoose.model('IntakeForm', intakeFormSchema);