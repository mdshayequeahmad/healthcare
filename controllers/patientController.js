const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');

// @desc    Add a new patient
// @route   POST /api/patients
// @access  Private
const addPatient = asyncHandler(async (req, res) => {
  const { name, age, gender, contact, medicalHistory } = req.body;

  if (!name || !age || !gender || !contact) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const patient = await Patient.create({
    name,
    age,
    gender,
    contact,
    medicalHistory: medicalHistory || '',
    createdBy: req.user._id,
  });

  res.status(201).json(patient);
});

// @desc    Get all patients for the logged-in user
// @route   GET /api/patients
// @access  Private
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ createdBy: req.user._id });
  res.status(200).json(patients);
});

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  res.status(200).json(patient);
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedPatient);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  await patient.remove();
  res.status(200).json({ message: 'Patient removed' });
});

module.exports = {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};