const express = require('express');
const {
  createComment,
  getComments,
  getReplies,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public get (top-level comments)
router.get('/', getComments);
// Public get replies
router.get('/:id/replies', getReplies);

// Protected routes
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment); // Admin can delete any via middleware

module.exports = router;