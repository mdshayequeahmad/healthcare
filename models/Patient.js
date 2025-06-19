const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide patient name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Please provide patient age'],
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age seems unrealistic'],
  },
  gender: {
    type: String,
    required: [true, 'Please provide patient gender'],
    enum: ['male', 'female', 'other'],
  },
  contact: {
    type: String,
    required: [true, 'Please provide contact information'],
  },
  medicalHistory: {
    type: String,
    default: '',
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

module.exports = mongoose.model('Patient', patientSchema);