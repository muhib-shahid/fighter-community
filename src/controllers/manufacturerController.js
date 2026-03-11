const Manufacturer = require('../models/Manufacturer');

exports.createManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.create(req.body);
    res.status(201).json({ success: true, data: manufacturer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getManufacturers = async (req, res) => {
  try {
    const { country, sort } = req.query;
    let query = {};
    if (country) query.country = country;

    let sortOption = {};
    if (sort === 'name') sortOption.name = 1;
    else if (sort === '-name') sortOption.name = -1;
    else sortOption.createdAt = -1;

    const manufacturers = await Manufacturer.find(query).sort(sortOption);
    res.json({ success: true, count: manufacturers.length, data: manufacturers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: manufacturer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!manufacturer) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: manufacturer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) return res.status(404).json({ success: false, error: 'Not found' });

    // Check if any fighter uses this manufacturer
    const Fighter = require('../models/Fighter');
    const fighterCount = await Fighter.countDocuments({ manufacturer: req.params.id });
    if (fighterCount > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete manufacturer with associated fighters' });
    }

    await manufacturer.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};