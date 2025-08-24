const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../dist/models/user.model.js');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemocare_db';

const testPatient = {
  email: 'test.patient@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'Male',
  mobile: '9876543210',
  dateOfBirth: new Date('1990-01-01'),
  bloodGroup: 'O-',
  city: 'Hyderabad',
  pincode: '500001',
  role: 'patient',
  isActive: true,
  lastLogin: new Date()
};

async function createTestPatient() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test patient already exists
    const existingPatient = await User.findOne({ email: testPatient.email });
    if (existingPatient) {
      console.log('🗑️  Test patient already exists, removing...');
      await User.deleteOne({ email: testPatient.email });
    }

    // Create test patient (password will be hashed automatically by the model)
    const newPatient = new User({
      ...testPatient,
      password: testPatient.password
    });

    await newPatient.save();
    console.log('✅ Test patient created successfully');

    console.log('\n📋 Test Patient Details:');
    console.log('Email:', testPatient.email);
    console.log('Password:', testPatient.password);
    console.log('Name:', testPatient.firstName, testPatient.lastName);
    console.log('Role:', testPatient.role);
    console.log('Blood Group:', testPatient.bloodGroup);

    console.log('\n🔑 Login Credentials:');
    console.log('Email: test.patient@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error creating test patient:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
createTestPatient();
