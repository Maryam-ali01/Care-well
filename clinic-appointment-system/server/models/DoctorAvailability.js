const mongoose = require('mongoose');

// Optional bonus model from the brief (schema only, not wired to booking).
const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  availableDays: [{ type: String }],
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '17:00' },
});

module.exports = mongoose.model('DoctorAvailability', availabilitySchema);
