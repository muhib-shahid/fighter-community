const Review = require('../models/Review');
const Fighter = require('../models/Fighter');

// @desc    Create review (logged in users)
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { fighter, rating, title, comment } = req.body;

    // Check if fighter exists
    const fighterExists = await Fighter.findById(fighter);
    if (!fighterExists) {
      return res.status(404).json({ success: false, error: 'Fighter not found' });
    }

    // Check if user already reviewed this fighter
    const existing = await Review.findOne({ user: req.user.id, fighter });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You already reviewed this fighter' });
    }

    const review = await Review.create({
      user: req.user.id,
      fighter,
      rating,
      title,
      comment
    });

    // Populate user info for response
    await review.populate('user', 'username');

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get reviews for a fighter (public)
// @route   GET /api/reviews?fighter=xxx
exports.getReviews = async (req, res) => {
  try {
    const { fighter } = req.query;
    if (!fighter) {
      return res.status(400).json({ success: false, error: 'Fighter ID required' });
    }

    const reviews = await Review.find({ fighter })
      .populate('user', 'username')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found or not authorized' });
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate('user', 'username');
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete own review (or admin can delete any)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    // Admin can delete any; user only their own
    let query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const review = await Review.findOneAndDelete(query);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found or not authorized' });
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};