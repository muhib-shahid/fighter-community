const Weapon = require('../models/Weapon');
const Fighter = require('../models/Fighter');

// @desc    Create weapon (admin only)
// @route   POST /api/weapons
exports.createWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.create(req.body);
    res.status(201).json({ success: true, data: weapon });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all weapons (public, with filtering & sorting)
// @route   GET /api/weapons
exports.getWeapons = async (req, res) => {
  try {
    const { type, minRange, maxRange, sort } = req.query;
    let query = {};

    if (type) query.type = type;
    if (minRange || maxRange) {
      query.range = {};
      if (minRange) query.range.$gte = Number(minRange);
      if (maxRange) query.range.$lte = Number(maxRange);
    }

    let sortOption = {};
    if (sort === 'range') sortOption.range = 1;
    else if (sort === '-range') sortOption.range = -1;
    else if (sort === 'name') sortOption.name = 1;
    else if (sort === '-name') sortOption.name = -1;
    else sortOption.createdAt = -1; // default

    const weapons = await Weapon.find(query).sort(sortOption);
    res.json({ success: true, count: weapons.length, data: weapons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single weapon (public)
// @route   GET /api/weapons/:id
exports.getWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id);
    if (!weapon) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: weapon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update weapon (admin only)
// @route   PUT /api/weapons/:id
exports.updateWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!weapon) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: weapon });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete weapon (admin only)
// @route   DELETE /api/weapons/:id
exports.deleteWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id);
    if (!weapon) return res.status(404).json({ success: false, error: 'Not found' });

    // Check if any fighter references this weapon
    const fighterCount = await Fighter.countDocuments({ weapons: req.params.id });
    if (fighterCount > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete weapon that is used by fighters' });
    }

    await weapon.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};