const mongoose = require('mongoose');

const hangarSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['want', 'owned', 'flown'],
    default: 'want'
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Ensure a user can't add the same fighter twice
hangarSchema.index({ user: 1, fighter: 1 }, { unique: true });

module.exports = mongoose.model('Hangar', hangarSchema);