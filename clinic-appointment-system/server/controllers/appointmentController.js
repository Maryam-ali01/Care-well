const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const {
  HttpError,
  asyncHandler,
  isValidTime,
  isValidDateString,
  toDateOnly,
} = require('../utils/helpers');

const populateAll = (query) =>
  query
    .populate('patient', 'name email phone')
    .populate('doctor', 'name email specialization experience');

// Patient books an appointment.
exports.createAppointment = asyncHandler(async (req, res) => {
  const { doctor, appointmentDate, appointmentTime, reason } = req.body;

  if (!doctor || !mongoose.isValidObjectId(doctor)) {
    throw new HttpError(400, 'Please select a doctor.');
  }
  if (!isValidDateString(appointmentDate)) {
    throw new HttpError(400, 'Please select a valid date.');
  }
  if (!isValidTime(appointmentTime)) {
    throw new HttpError(400, 'Please select a valid time (HH:MM).');
  }
  if (!reason || reason.trim().length < 3) {
    throw new HttpError(400, 'Please describe the reason for your visit.');
  }

  const slot = new Date(`${appointmentDate}T${appointmentTime}:00`);
  if (slot.getTime() <= Date.now()) {
    throw new HttpError(400, 'You cannot book an appointment in the past.');
  }

  const doctorUser = await User.findOne({
    _id: doctor,
    role: 'doctor',
    isActive: true,
  });
  if (!doctorUser) {
    throw new HttpError(404, 'This doctor is not available.');
  }

  const date = toDateOnly(appointmentDate);

  const duplicate = await Appointment.findOne({
    patient: req.user._id,
    doctor,
    appointmentDate: date,
    appointmentTime,
    status: { $in: ['pending', 'approved'] },
  });
  if (duplicate) {
    throw new HttpError(
      409,
      'You already have an appointment with this doctor at that date and time.'
    );
  }

  const taken = await Appointment.findOne({
    doctor,
    appointmentDate: date,
    appointmentTime,
    status: 'approved',
  });
  if (taken) {
    throw new HttpError(409, 'That time slot is already booked. Pick another time.');
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor,
    appointmentDate: date,
    appointmentTime,
    reason,
  });

  const populated = await populateAll(Appointment.findById(appointment._id));
  res.status(201).json({ appointment: populated });
});

exports.getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await populateAll(
    Appointment.find({ patient: req.user._id }).sort({
      appointmentDate: -1,
      appointmentTime: -1,
    })
  );
  res.json({ appointments });
});

exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await populateAll(
    Appointment.find({ doctor: req.user._id }).sort({
      appointmentDate: -1,
      appointmentTime: -1,
    })
  );
  res.json({ appointments });
});

exports.getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await populateAll(Appointment.findById(req.params.id));
  if (!appointment) {
    throw new HttpError(404, 'Appointment not found.');
  }

  const { role, _id } = req.user;
  const ownsAsPatient =
    role === 'patient' && appointment.patient._id.equals(_id);
  const ownsAsDoctor = role === 'doctor' && appointment.doctor._id.equals(_id);

  if (role !== 'admin' && !ownsAsPatient && !ownsAsDoctor) {
    throw new HttpError(403, 'You cannot view this appointment.');
  }
  res.json({ appointment });
});

// Doctor approves or rejects an appointment assigned to them.
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    throw new HttpError(400, 'Status must be "approved" or "rejected".');
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new HttpError(404, 'Appointment not found.');
  }
  if (!appointment.doctor.equals(req.user._id)) {
    throw new HttpError(403, 'You can only manage your own appointments.');
  }
  if (appointment.status !== 'pending') {
    throw new HttpError(
      400,
      `This appointment is already ${appointment.status}.`
    );
  }

  if (status === 'approved') {
    const clash = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: 'approved',
    });
    if (clash) {
      throw new HttpError(
        409,
        'You already approved another appointment at this time.'
      );
    }
  }

  appointment.status = status;
  await appointment.save();

  const populated = await populateAll(Appointment.findById(appointment._id));
  res.json({ appointment: populated });
});

// Patient cancels their own pending appointment.
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new HttpError(404, 'Appointment not found.');
  }
  if (!appointment.patient.equals(req.user._id)) {
    throw new HttpError(403, 'You can only cancel your own appointments.');
  }
  if (appointment.status !== 'pending') {
    throw new HttpError(400, 'Only pending appointments can be cancelled.');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  const populated = await populateAll(Appointment.findById(appointment._id));
  res.json({ appointment: populated });
});
