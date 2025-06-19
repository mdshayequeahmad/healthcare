const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  assignDoctor,
  getMappings,
  getPatientDoctors,
  removeDoctor,
} = require('../controllers/mappingController');

router.route('/')
  .post(protect, assignDoctor)
  .get(protect, getMappings);

router.route('/:patientId')
  .get(protect, getPatientDoctors);

router.route('/:id')
  .delete(protect, removeDoctor);

module.exports = router;