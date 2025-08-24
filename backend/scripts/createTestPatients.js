const mongoose = require('mongoose');
const { Patient } = require('../dist/models/patient.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemocare_db';

// Test patient data with all required fields
const testPatients = [
  {
    user_id: 'P001',
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'male',
    phone: '+91 9876543210',
    bloodGroup: 'A+',
    height: 175,
    weight: 70,
    hemoglobin: 8.2, // Low
    ironLevel: 180, // High
    heartRate: 82, // Normal
    bloodPressure: {
      systolic: 120,
      diastolic: 80
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+91 9876543211',
      address: '123 Main St, City'
    },
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    medicalHistory: {
      conditions: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin'],
      medications: ['Metformin', 'Amlodipine'],
      surgeries: ['Appendectomy - 2010'],
      familyHistory: ['Father: Heart Disease', 'Mother: Diabetes']
    },
    status: 'active',
    role: 'patient'
  },
  {
    user_id: 'P002',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    dateOfBirth: new Date('1992-07-22'),
    gender: 'female',
    phone: '+91 9876543212',
    bloodGroup: 'O-',
    height: 162,
    weight: 55,
    hemoglobin: 12.5, // Normal
    ironLevel: 85, // Normal
    heartRate: 75, // Normal
    bloodPressure: {
      systolic: 118,
      diastolic: 78
    },
    emergencyContact: {
      name: 'Mike Wilson',
      relationship: 'Brother',
      phone: '+91 9876543213',
      address: '456 Oak Ave, City'
    },
    address: {
      street: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    medicalHistory: {
      conditions: ['Asthma'],
      allergies: ['Dust', 'Pollen'],
      medications: ['Albuterol Inhaler'],
      surgeries: [],
      familyHistory: ['Mother: Asthma']
    },
    status: 'active',
    role: 'patient'
  },
  {
    user_id: 'P003',
    email: 'michael.chen@example.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: new Date('1978-11-08'),
    gender: 'male',
    phone: '+91 9876543214',
    bloodGroup: 'B+',
    height: 180,
    weight: 85,
    hemoglobin: 15.2, // Normal
    ironLevel: 95, // Normal
    heartRate: 88, // Normal
    bloodPressure: {
      systolic: 135,
      diastolic: 85
    },
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Wife',
      phone: '+91 9876543215',
      address: '789 Pine Rd, City'
    },
    address: {
      street: '789 Pine Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    medicalHistory: {
      conditions: ['High Cholesterol'],
      allergies: ['Shellfish'],
      medications: ['Atorvastatin'],
      surgeries: ['Knee Surgery - 2018'],
      familyHistory: ['Father: High Cholesterol', 'Mother: Hypertension']
    },
    status: 'active',
    role: 'patient'
  }
];

async function createTestPatients() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing patients
    await Patient.deleteMany({});
    console.log('🗑️  Cleared existing patients');

    // Create test patients
    console.log('🔐 Creating test patients...');
    const createdPatients = [];
    
    for (const patientData of testPatients) {
      const patient = new Patient(patientData);
      await patient.save();
      createdPatients.push(patient);
      console.log(`✅ Created patient: ${patient.fullName} (${patient.email})`);
    }

    console.log(`\n🎉 Successfully created ${createdPatients.length} test patients`);
    
    // Test login for first patient
    console.log('\n🧪 Testing login for first patient...');
    const testPatient = createdPatients[0];
    const testPassword = 'password123';
    const isValidPassword = await testPatient.comparePassword(testPassword);
    
    if (isValidPassword) {
      console.log(`✅ Login test successful for ${testPatient.fullName}`);
      console.log(`📧 Email: ${testPatient.email}`);
      console.log(`🔑 Password: ${testPassword}`);
      console.log(`🩸 Health Status:`, testPatient.healthStatus);
      console.log(`📊 BMI: ${testPatient.bmi}`);
      console.log(`🎂 Age: ${testPatient.age}`);
    } else {
      console.log('❌ Login test failed');
    }

    console.log('\n🔑 All patients can login with: password123');
    console.log('📋 Test emails:');
    testPatients.forEach(p => console.log(`  - ${p.email}`));

  } catch (error) {
    console.error('❌ Error creating test patients:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the creation
createTestPatients();
