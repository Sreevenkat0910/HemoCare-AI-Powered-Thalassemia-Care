const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemocare_db';

// Test users data
const testUsers = [
  // Test Doctor
  {
    user_id: 'DOC001',
    email: 'test.doctor@example.com',
    password: 'password123',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'doctor',
    gender: 'Female',
    mobile: '9876543211',
    dateOfBirth: new Date('1985-05-15'),
    bloodGroup: 'A+',
    city: 'Hyderabad',
    pincode: '500001',
    isActive: true,
    lastLogin: new Date()
  },
  
  // Test Patient
  {
    user_id: 'PAT001',
    email: 'test.patient@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    gender: 'Male',
    mobile: '9876543210',
    dateOfBirth: new Date('1990-01-01'),
    bloodGroup: 'O-',
    city: 'Hyderabad',
    pincode: '500001',
    isActive: true,
    lastLogin: new Date()
  },
  
  // Test Blood Donor
  {
    user_id: 'DON001',
    email: 'john.emergency@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Emergency',
    role: 'blood-donor',
    gender: 'Male',
    mobile: '9876543201',
    dateOfBirth: new Date('1988-03-15'),
    bloodGroup: 'A+',
    city: 'Hyderabad',
    pincode: '500001',
    donorType: 'emergency-donor',
    isActive: true,
    lastLogin: new Date()
  },
  
  // Test Blood Donor 2
  {
    user_id: 'DON002',
    email: 'mike.bridge@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Bridge',
    role: 'blood-donor',
    gender: 'Male',
    mobile: '9876543202',
    dateOfBirth: new Date('1987-07-22'),
    bloodGroup: 'O+',
    city: 'Hyderabad',
    pincode: '500001',
    donorType: 'bridge-donor',
    isActive: true,
    lastLogin: new Date()
  },
  
  // Test Blood Donor 3
  {
    user_id: 'DON003',
    email: 'sarah.emergency@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Emergency',
    role: 'blood-donor',
    gender: 'Female',
    mobile: '9876543203',
    dateOfBirth: new Date('1992-11-08'),
    bloodGroup: 'B+',
    city: 'Hyderabad',
    pincode: '500001',
    donorType: 'emergency-donor',
    isActive: true,
    lastLogin: new Date()
  },
  
  // Test Admin
  {
    user_id: 'ADM001',
    email: 'admin@hemocare.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    gender: 'Other',
    mobile: '9876543200',
    dateOfBirth: new Date('1980-01-01'),
    bloodGroup: 'AB+',
    city: 'Hyderabad',
    pincode: '500001',
    isActive: true,
    lastLogin: new Date()
  }
];

async function createTestUsers() {
  try {
    // Connect to hemoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to hemocare_db');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Clear existing users
    await usersCollection.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      testUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );

    // Insert users into database
    const result = await usersCollection.insertMany(usersWithHashedPasswords);
    console.log(`✅ Successfully created ${result.length} test users`);

    // Display created users
    console.log('\n📋 Test Users Created:');
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.role} - ${user.firstName} ${user.lastName}`);
    });

    console.log('\n🔑 Login Credentials:');
    console.log('All users use password: password123 (except admin: admin123)');
    console.log('\n📧 Emails by Role:');
    
    const usersByRole = testUsers.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user.email);
      return acc;
    }, {});
    
    Object.entries(usersByRole).forEach(([role, emails]) => {
      console.log(`\n${role.toUpperCase()}:`);
      emails.forEach(email => console.log(`  - ${email}`));
    });

    console.log('\n🎉 Test users created successfully!');
    console.log('🚀 Ready for authentication testing!');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
createTestUsers();

