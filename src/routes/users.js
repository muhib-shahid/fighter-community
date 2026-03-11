const express = require('express');
const {
  getProfile,
  addToHangar,
  updateHangarItem,
  removeFromHangar
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/profile', getProfile);
router.post('/hangar', addToHangar);
router.route('/hangar/:id')
  .put(updateHangarItem)
  .delete(removeFromHangar);

module.exports = router;