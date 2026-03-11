const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Manufacturer name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name too long']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    enum: ['USA', 'Russia', 'China', 'UK', 'France', 'Other']
  }
}, { timestamps: true });

manufacturerSchema.index({ country: 1 });

module.exports = mongoose.model('Manufacturer', manufacturerSchema);