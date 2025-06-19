const mongoose = require('mongoose');

const mappingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Please provide patient ID'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Please provide doctor ID'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate mappings
mappingSchema.index({ patient: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model('Mapping', mappingSchema);