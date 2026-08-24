require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Visit = require('./models/Visit');
const IntakeForm = require('./models/IntakeForm');
const Prescription = require('./models/Prescription');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Visit.deleteMany({});
    await IntakeForm.deleteMany({});
    await Prescription.deleteMany({});
    console.log('🧹 Cleared existing collections');

    const passwordHash = await bcrypt.hash('roundsai123', 10);

    const doctor = await Doctor.create({
      email: 'dr.mehta@roundsai.demo',
      passwordHash,
      name: 'Dr. Aditi Mehta'
    });

    console.log('👨‍⚕️ Seeded doctor:', doctor.email);

    const ravi = await Patient.create({
      name: 'Ravi Kumar',
      dob: new Date('1978-03-14'),
      gender: 'male',
      allergies: ['Penicillin'],
      chronicConditions: ['Type 2 Diabetes'],
      currentMedications: ['Metformin 500mg']
    });

    await IntakeForm.create({
      patientId: ravi._id,
      symptoms: 'Increased thirst, fatigue, occasional blurred vision over the past 2 weeks',
      reasonForVisit: 'Routine diabetes follow-up',
      submittedAt: new Date()
    });

    await Visit.create({
      patientId: ravi._id,
      date: new Date(),
      reasonForVisit: 'Routine diabetes follow-up',
      status: 'waiting'
    });

    await Visit.create({
      patientId: ravi._id,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      reasonForVisit: 'Diabetes management check',
      status: 'done',
      diagnosisNotes: 'Blood sugar levels slightly elevated. Continued Metformin, advised dietary changes.'
    });

    const anjali = await Patient.create({
      name: 'Anjali Sharma',
      dob: new Date('1991-07-22'),
      gender: 'female',
      allergies: ['Sulfa drugs', 'Peanuts'],
      chronicConditions: ['Migraine', 'Seasonal Allergies'],
      currentMedications: ['Sumatriptan 50mg (as needed)']
    });

    await IntakeForm.create({
      patientId: anjali._id,
      symptoms: 'Severe headache on right side, sensitivity to light, nausea since this morning',
      reasonForVisit: 'Migraine flare-up',
      submittedAt: new Date()
    });

    await Visit.create({
      patientId: anjali._id,
      date: new Date(),
      reasonForVisit: 'Migraine flare-up',
      status: 'in-progress'
    });

    await Visit.create({
      patientId: anjali._id,
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      reasonForVisit: 'Seasonal allergy symptoms',
      status: 'done',
      diagnosisNotes: 'Prescribed antihistamines, symptoms improved on follow-up call.'
    });

    const priya = await Patient.create({
      name: 'Priya Singh',
      dob: new Date('1965-11-05'),
      gender: 'female',
      allergies: [],
      chronicConditions: ['Hypertension'],
      currentMedications: ['Amlodipine 5mg']
    });

    await IntakeForm.create({
      patientId: priya._id,
      symptoms: 'Mild dizziness in the mornings, otherwise feeling well',
      reasonForVisit: 'Blood pressure check-up',
      submittedAt: new Date()
    });

    await Visit.create({
      patientId: priya._id,
      date: new Date(),
      reasonForVisit: 'Blood pressure check-up',
      status: 'done',
      diagnosisNotes: 'BP well controlled at 128/82. Continue current dosage.'
    });

    console.log('🧑‍🤝‍🧑 Seeded 3 patients with intake forms and visits');
    console.log('');
    console.log('✅ Seed complete!');
    console.log('   Login email:    dr.mehta@roundsai.demo');
    console.log('   Login password: roundsai123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();