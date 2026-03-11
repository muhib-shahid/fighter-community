const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Weapon name is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['air-to-air', 'air-to-ground', 'multi-role']
  },
  range: {
    type: Number, // km
    required: true,
    min: [0, 'Range cannot be negative']
  }
}, { timestamps: true });

weaponSchema.index({ type: 1, range: -1 });

module.exports = mongoose.model('Weapon', weaponSchema);