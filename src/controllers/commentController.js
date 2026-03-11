const Comment = require('../models/Comment');
const Fighter = require('../models/Fighter');

// @desc    Create comment (logged in users)
// @route   POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { fighter, parentComment, text } = req.body;

    // Verify fighter exists
    const fighterExists = await Fighter.findById(fighter);
    if (!fighterExists) {
      return res.status(404).json({ success: false, error: 'Fighter not found' });
    }

    // If parent comment provided, verify it exists and belongs to same fighter
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent comment not found' });
      }
      if (parent.fighter.toString() !== fighter) {
        return res.status(400).json({ success: false, error: 'Parent comment does not belong to this fighter' });
      }
    }

    const comment = await Comment.create({
      user: req.user.id,
      fighter,
      parentComment,
      text
    });

    await comment.populate('user', 'username');
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get comments for a fighter (public)
// @route   GET /api/comments?fighter=xxx
exports.getComments = async (req, res) => {
  try {
    const { fighter } = req.query;
    if (!fighter) {
      return res.status(400).json({ success: false, error: 'Fighter ID required' });
    }

    // Get top-level comments and populate user
    const comments = await Comment.find({ fighter, parentComment: null })
      .populate('user', 'username')
      .sort('-createdAt');

    // For each comment, optionally fetch replies (can be done recursively, but here we'll just indicate they exist)
    // To keep it simple, we'll return only top-level. The frontend can fetch replies by querying with parentComment.
    res.json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get replies to a comment (public)
// @route   GET /api/comments/:id/replies
exports.getReplies = async (req, res) => {
  try {
    const replies = await Comment.find({ parentComment: req.params.id })
      .populate('user', 'username')
      .sort('createdAt');
    res.json({ success: true, count: replies.length, data: replies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update own comment
// @route   PUT /api/comments/:id
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, user: req.user.id });
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found or not authorized' });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();
    await comment.populate('user', 'username');
    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete comment (own or admin)
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const comment = await Comment.findOneAndDelete(query);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found or not authorized' });
    }

    // Optionally delete all replies (cascade)
    await Comment.deleteMany({ parentComment: req.params.id });

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};