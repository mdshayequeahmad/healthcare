const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

router.route('/')
  .post(protect, addPatient)
  .get(protect, getPatients);

router.route('/:id')
  .get(protect, getPatient)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;