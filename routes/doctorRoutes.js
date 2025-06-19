const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

router.route('/')
  .post(protect, addDoctor)
  .get(protect, getDoctors);

router.route('/:id')
  .get(protect, getDoctor)
  .put(protect, updateDoctor)
  .delete(protect, deleteDoctor);

module.exports = router;