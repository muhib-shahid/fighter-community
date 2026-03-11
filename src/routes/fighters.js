const express = require('express');
const {
  createFighter,
  getFighters,
  getFighter,
  updateFighter,
  deleteFighter,
  getAvgSpeedByManufacturer,
  getCountByType
} = require('../controllers/fighterController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public stats routes
router.get('/stats/avg-speed-by-manufacturer', getAvgSpeedByManufacturer);
router.get('/stats/count-by-type', getCountByType);

// Public read
router.get('/', getFighters);
router.get('/:id', getFighter);

// Admin only write
router.post('/', protect, admin, createFighter);
router.put('/:id', protect, admin, updateFighter);
router.delete('/:id', protect, admin, deleteFighter);

module.exports = router;