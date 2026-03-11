const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fighter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  }
}, { timestamps: true });

// One user can only review a fighter once
reviewSchema.index({ user: 1, fighter: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);