const User = require('../models/User');
const Appointment = require('../models/Appointment');
const {
  HttpError,
  asyncHandler,
  isEmail,
  escapeRegex,
} = require('../utils/helpers');

exports.getUsers = asyncHandler(async (req, res) => {
  const { q, role, status } = req.query;
  const filter = {};

  if (role && ['admin', 'doctor', 'patient'].includes(role)) {
    filter.role = role;
  }
  if (status === 'active') {
    filter.isActive = true;
  }
  if (status === 'inactive') {
    filter.isActive = false;
  }
  if (q && q.trim()) {
    const pattern = { $regex: escapeRegex(q.trim()), $options: 'i' };
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ users });
});

exports.createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, specialization, experience, phone } = req.body;

  if (!name || name.trim().length < 2) {
    throw new HttpError(400, 'Doctor name is required.');
  }
  if (!isEmail(email)) {
    throw new HttpError(400, 'A valid email is required.');
  }
  if (!password || password.length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters.');
  }
  if (!specialization || !specialization.trim()) {
    throw new HttpError(400, 'Specialization is required.');
  }
  if (experience === undefined || experience === '' || Number(experience) < 0) {
    throw new HttpError(400, 'Experience (in years) is required.');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new HttpError(409, 'An account with this email already exists.');
  }

  const doctor = await User.create({
    name,
    email,
    password,
    phone,
    specialization,
    experience: Number(experience),
    role: 'doctor',
  });
  res.status(201).json({ doctor });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User not found.');
  }
  if (user.role === 'admin') {
    throw new HttpError(400, 'Admin accounts cannot be deleted.');
  }

  await Appointment.deleteMany({
    $or: [{ patient: user._id }, { doctor: user._id }],
  });
  await user.deleteOne();
  res.json({ message: `${user.name} was deleted.` });
});

exports.toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User not found.');
  }
  if (user.role === 'admin') {
    throw new HttpError(400, 'Admin accounts cannot be deactivated.');
  }

  user.isActive = !user.isActive;
  await user.save();
  res.json({ user });
});

exports.getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patient', 'name email phone')
    .populate('doctor', 'name email specialization experience')
    .sort({ createdAt: -1 });
  res.json({ appointments });
});

exports.getStats = asyncHandler(async (req, res) => {
  const [totalPatients, totalDoctors, totalAppointments, grouped, recent] =
    await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Appointment.find()
        .populate('patient', 'name')
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

  const byStatus = { pending: 0, approved: 0, rejected: 0, cancelled: 0 };
  grouped.forEach((g) => {
    byStatus[g._id] = g.count;
  });

  res.json({
    totalPatients,
    totalDoctors,
    totalAppointments,
    byStatus,
    recentAppointments: recent,
  });
});
