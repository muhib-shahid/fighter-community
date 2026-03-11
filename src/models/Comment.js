const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  }
}, { timestamps: true });

commentSchema.index({ fighter: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);