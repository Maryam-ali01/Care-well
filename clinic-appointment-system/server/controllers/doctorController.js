const User = require('../models/User');
const { HttpError, asyncHandler, escapeRegex } = require('../utils/helpers');

exports.getFeatured = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor', isActive: true })
    .sort({ experience: -1 })
    .limit(3);
  res.json({ doctors });
});

exports.getSpecializations = asyncHandler(async (req, res) => {
  const list = await User.distinct('specialization', {
    role: 'doctor',
    isActive: true,
  });
  res.json({ specializations: list.filter(Boolean).sort() });
});

exports.getDoctors = asyncHandler(async (req, res) => {
  const { q, specialization } = req.query;
  const filter = { role: 'doctor', isActive: true };

  if (q && q.trim()) {
    filter.name = { $regex: escapeRegex(q.trim()), $options: 'i' };
  }
  if (specialization && specialization.trim()) {
    filter.specialization = {
      $regex: `^${escapeRegex(specialization.trim())}$`,
      $options: 'i',
    };
  }

  const doctors = await User.find(filter).sort({ name: 1 });
  res.json({ doctors });
});

exports.getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await User.findOne({
    _id: req.params.id,
    role: 'doctor',
    isActive: true,
  });
  if (!doctor) {
    throw new HttpError(404, 'Doctor not found.');
  }
  res.json({ doctor });
});
