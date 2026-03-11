const User = require('../models/User');
const Hangar = require('../models/Hangar');
const Fighter = require('../models/Fighter');

// @desc    Get user profile with hangar
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const hangar = await Hangar.find({ user: req.user.id })
      .populate('fighter', 'name type topSpeed');
    
    res.json({
      success: true,
      data: {
        user,
        hangar
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add fighter to hangar
// @route   POST /api/users/hangar
exports.addToHangar = async (req, res) => {
  try {
    const { fighterId, status, notes } = req.body;

    // Check if fighter exists
    const fighter = await Fighter.findById(fighterId);
    if (!fighter) {
      return res.status(404).json({ success: false, error: 'Fighter not found' });
    }

    // Check if already in hangar
    const existing = await Hangar.findOne({ user: req.user.id, fighter: fighterId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Fighter already in hangar' });
    }

    const hangarItem = await Hangar.create({
      user: req.user.id,
      fighter: fighterId,
      status,
      notes
    });

    res.status(201).json({ success: true, data: hangarItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update hangar item (status/notes)
// @route   PUT /api/users/hangar/:id
exports.updateHangarItem = async (req, res) => {
  try {
    const hangarItem = await Hangar.findOne({ _id: req.params.id, user: req.user.id });
    if (!hangarItem) {
      return res.status(404).json({ success: false, error: 'Hangar item not found' });
    }

    const { status, notes } = req.body;
    if (status) hangarItem.status = status;
    if (notes !== undefined) hangarItem.notes = notes;

    await hangarItem.save();
    res.json({ success: true, data: hangarItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Remove from hangar
// @route   DELETE /api/users/hangar/:id
exports.removeFromHangar = async (req, res) => {
  try {
    const hangarItem = await Hangar.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!hangarItem) {
      return res.status(404).json({ success: false, error: 'Hangar item not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};