const Fighter = require('../models/Fighter');

// @desc    Create fighter (admin only)
// @route   POST /api/fighters
exports.createFighter = async (req, res) => {
  try {
    const fighter = await Fighter.create(req.body);
    const populated = await Fighter.findById(fighter._id)
      .populate('manufacturer')
      .populate('weapons');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all fighters (public, with filtering/sorting)
// @route   GET /api/fighters
exports.getFighters = async (req, res) => {
  try {
    const { type, manufacturer, minSpeed, maxSpeed, sort, page = 1, limit = 10 } = req.query;
    let query = {};

    if (type) query.type = type;
    if (manufacturer) query.manufacturer = manufacturer;
    if (minSpeed || maxSpeed) {
      query.topSpeed = {};
      if (minSpeed) query.topSpeed.$gte = Number(minSpeed);
      if (maxSpeed) query.topSpeed.$lte = Number(maxSpeed);
    }

    let sortOption = {};
    if (sort === 'name') sortOption.name = 1;
    else if (sort === '-name') sortOption.name = -1;
    else if (sort === 'speed') sortOption.topSpeed = 1;
    else if (sort === '-speed') sortOption.topSpeed = -1;
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const fighters = await Fighter.find(query)
      .populate('manufacturer')
      .populate('weapons')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Fighter.countDocuments(query);

    res.json({
      success: true,
      count: fighters.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: fighters
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single fighter (public)
// @route   GET /api/fighters/:id
exports.getFighter = async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id)
      .populate('manufacturer')
      .populate('weapons');
    if (!fighter) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: fighter });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update fighter (admin only)
// @route   PUT /api/fighters/:id
exports.updateFighter = async (req, res) => {
  try {
    const fighter = await Fighter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('manufacturer')
      .populate('weapons');
    if (!fighter) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: fighter });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete fighter (admin only)
// @route   DELETE /api/fighters/:id
exports.deleteFighter = async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);
    if (!fighter) return res.status(404).json({ success: false, error: 'Not found' });

    // Check dependencies (Hangar, Review, Comment) – optional, but good practice
    const Hangar = require('../models/Hangar');
    const Review = require('../models/Review');
    const Comment = require('../models/Comment');
    const hangarCount = await Hangar.countDocuments({ fighter: req.params.id });
    const reviewCount = await Review.countDocuments({ fighter: req.params.id });
    const commentCount = await Comment.countDocuments({ fighter: req.params.id });
    if (hangarCount + reviewCount + commentCount > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete fighter with existing user data' });
    }

    await fighter.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Aggregations
// @desc    Average top speed per manufacturer
// @route   GET /api/fighters/stats/avg-speed-by-manufacturer
exports.getAvgSpeedByManufacturer = async (req, res) => {
  try {
    const stats = await Fighter.aggregate([
      {
        $lookup: {
          from: 'manufacturers',
          localField: 'manufacturer',
          foreignField: '_id',
          as: 'manu'
        }
      },
      { $unwind: '$manu' },
      {
        $group: {
          _id: '$manu.name',
          avgSpeed: { $avg: '$topSpeed' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgSpeed: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Count fighters by type
// @route   GET /api/fighters/stats/count-by-type
exports.getCountByType = async (req, res) => {
  try {
    const stats = await Fighter.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};