const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Fighter name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name too long']
  },
  type: {
    type: String,
    required: true,
    enum: ['bomber', 'multirole', 'fighter', 'interceptor']
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manufacturer',
    required: true
  },
  topSpeed: {
    type: Number, // Mach
    required: true,
    min: [0, 'Speed must be positive'],
    max: [10, 'Realistic max Mach 10']
  },
  maneuverability: {
    type: String,
    enum: ['low', 'medium', 'high', 'extremely high'],
    default: 'medium'
  },
  stability: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  defense: {
    type: String,
    default: 'none'
  },
  airToAirCapability: {
    type: String,
    required: true,
    enum: ['poor', 'fair', 'good', 'excellent']
  },
  airToGroundCapability: {
    type: String,
    required: true,
    enum: ['poor', 'fair', 'good', 'excellent']
  },
  weapons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weapon'
  }]
}, { timestamps: true });

// Indexes for common queries
fighterSchema.index({ type: 1 });
fighterSchema.index({ manufacturer: 1, topSpeed: -1 });

module.exports = mongoose.model('Fighter', fighterSchema);