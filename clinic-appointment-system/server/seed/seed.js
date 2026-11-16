require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const demoUsers = [
  {
    name: 'Clinic Admin',
    email: 'admin@clinic.com',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    name: 'Dr. Ahmed',
    email: 'doctor@clinic.com',
    password: 'Doctor123!',
    role: 'doctor',
    specialization: 'Cardiologist',
    experience: 5,
  },
  {
    name: 'Sample Patient',
    email: 'patient@clinic.com',
    password: 'Patient123!',
    role: 'patient',
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const data of demoUsers) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      console.log(`Skipped (already exists): ${data.email}`);
      continue;
    }
    await User.create(data); // password is hashed by the model's pre-save hook
    console.log(`Created: ${data.email}`);
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
