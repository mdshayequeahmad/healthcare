const asyncHandler = require('express-async-handler');
const Mapping = require('../models/Mapping');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Assign a doctor to a patient
// @route   POST /api/mappings
// @access  Private
const assignDoctor = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = req.body;

  if (!patientId || !doctorId) {
    res.status(400);
    throw new Error('Please provide both patient and doctor IDs');
  }

  // Check if patient exists and is created by the logged-in user
  const patient = await Patient.findOne({
    _id: patientId,
    createdBy: req.user._id,
  });
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found or not authorized');
  }

  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check if mapping already exists
  const existingMapping = await Mapping.findOne({
    patient: patientId,
    doctor: doctorId,
  });
  if (existingMapping) {
    res.status(400);
    throw new Error('This doctor is already assigned to the patient');
  }

  const mapping = await Mapping.create({
    patient: patientId,
    doctor: doctorId,
    createdBy: req.user._id,
  });

  res.status(201).json(mapping);
});

// @desc    Get all patient-doctor mappings
// @route   GET /api/mappings
// @access  Private
const getMappings = asyncHandler(async (req, res) => {
  const mappings = await Mapping.find({})
    .populate('patient', 'name age gender')
    .populate('doctor', 'name specialization');
  res.status(200).json(mappings);
});

// @desc    Get all doctors assigned to a specific patient
// @route   GET /api/mappings/:patientId
// @access  Private
const getPatientDoctors = asyncHandler(async (req, res) => {
  // First check if the patient exists and is created by the logged-in user
  const patient = await Patient.findOne({
    _id: req.params.patientId,
    createdBy: req.user._id,
  });
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found or not authorized');
  }

  const mappings = await Mapping.find({ patient: req.params.patientId })
    .populate('doctor', 'name specialization contact availableDays');
  
  res.status(200).json(mappings);
});

// @desc    Remove a doctor from a patient
// @route   DELETE /api/mappings/:id
// @access  Private
const removeDoctor = asyncHandler(async (req, res) => {
  const mapping = await Mapping.findById(req.params.id);

  if (!mapping) {
    res.status(404);
    throw new Error('Mapping not found');
  }

  // Check if the logged-in user created the patient or is admin
  const patient = await Patient.findById(mapping.patient);
  if (
    patient.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(401);
    throw new Error('Not authorized to remove this mapping');
  }

  await mapping.remove();
  res.status(200).json({ message: 'Doctor removed from patient' });
});

module.exports = {
  assignDoctor,
  getMappings,
  getPatientDoctors,
  removeDoctor,
};