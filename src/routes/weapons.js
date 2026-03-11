const express = require('express');
const {
  createWeapon,
  getWeapons,
  getWeapon,
  updateWeapon,
  deleteWeapon
} = require('../controllers/weaponController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public read
router.get('/', getWeapons);
router.get('/:id', getWeapon);

// Admin only write
router.post('/', protect, admin, createWeapon);
router.put('/:id', protect, admin, updateWeapon);
router.delete('/:id', protect, admin, deleteWeapon);

module.exports = router;