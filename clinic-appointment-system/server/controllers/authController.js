const User = require('../models/User');
const {
  HttpError,
  asyncHandler,
  signToken,
  isEmail,
} = require('../utils/helpers');

// Public registration always creates a PATIENT. Any role sent by the client is ignored.
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || name.trim().length < 2) {
    throw new HttpError(400, 'Please enter your full name.');
  }
  if (!isEmail(email)) {
    throw new HttpError(400, 'Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters.');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new HttpError(409, 'An account with this email already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: 'patient',
  });

  res.status(201).json({ token: signToken(user._id), user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isEmail(email) || !password) {
    throw new HttpError(400, 'Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError(401, 'Incorrect email or password.');
  }
  if (!user.isActive) {
    throw new HttpError(403, 'Your account has been deactivated.');
  }

  res.json({ token: signToken(user._id), user });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, phone, bio, specialization, experience } = req.body;

  if (name !== undefined) {
    if (name.trim().length < 2) {
      throw new HttpError(400, 'Name is too short.');
    }
    user.name = name;
  }
  if (phone !== undefined) {
    user.phone = phone;
  }
  if (bio !== undefined) {
    user.bio = bio;
  }
  if (user.role === 'doctor') {
    if (specialization !== undefined && specialization.trim()) {
      user.specialization = specialization;
    }
    if (experience !== undefined && Number(experience) >= 0) {
      user.experience = Number(experience);
    }
  }

  await user.save();
  res.json({ user });
});
