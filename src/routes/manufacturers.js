const express = require('express');
const {
  createManufacturer,
  getManufacturers,
  getManufacturer,
  updateManufacturer,
  deleteManufacturer
} = require('../controllers/manufacturerController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public read
router.get('/', getManufacturers);
router.get('/:id', getManufacturer);

// Admin only write
router.post('/', protect, admin, createManufacturer);
router.put('/:id', protect, admin, updateManufacturer);
router.delete('/:id', protect, admin, deleteManufacturer);

module.exports = router;