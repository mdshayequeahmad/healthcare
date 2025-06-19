const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  specialization: {
    type: String,
    required: [true, 'Please provide doctor specialization'],
  },
  contact: {
    type: String,
    required: [true, 'Please provide contact information'],
  },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: [true, 'Please provide available days'],
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

module.exports = mongoose.model('Doctor', doctorSchema);