const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');

// @desc    Add a new doctor
// @route   POST /api/doctors
// @access  Private
const addDoctor = asyncHandler(async (req, res) => {
  const { name, specialization, contact, availableDays } = req.body;

  if (!name || !specialization || !contact || !availableDays) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const doctor = await Doctor.create({
    name,
    specialization,
    contact,
    availableDays,
    createdBy: req.user._id,
  });

  res.status(201).json(doctor);
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});
  res.status(200).json(doctors);
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Private
const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  res.status(200).json(doctor);
});

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check if the logged-in user matches the doctor's creator or is admin
  if (
    doctor.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(401);
    throw new Error('Not authorized to update this doctor');
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedDoctor);
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check if the logged-in user matches the doctor's creator or is admin
  if (
    doctor.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(401);
    throw new Error('Not authorized to delete this doctor');
  }

  await doctor.remove();
  res.status(200).json({ message: 'Doctor removed' });
});

module.exports = {
  addDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};