const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemocare_db';

async function showAllUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const allUsers = await usersCollection.find({}, { 
      projection: { 
        email: 1, 
        firstName: 1, 
        lastName: 1, 
        role: 1, 
        bloodGroup: 1,
        city: 1,
        mobile: 1,
        _id: 0 
      } 
    }).toArray();

    console.log(`\n👥 Total Users: ${allUsers.length}`);
    console.log('='.repeat(80));

    const usersByRole = {};
    allUsers.forEach(user => {
      const role = user.role || 'unknown';
      if (!usersByRole[role]) {
        usersByRole[role] = [];
      }
      usersByRole[role].push(user);
    });

    Object.keys(usersByRole).forEach(role => {
      console.log(`\n🔸 ${role.toUpperCase()} (${usersByRole[role].length} users):`);
      console.log('-'.repeat(50));
      
      usersByRole[role].forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
        console.log(`   Blood Group: ${user.bloodGroup || 'N/A'}`);
        console.log(`   City: ${user.city || 'N/A'}`);
        console.log(`   Mobile: ${user.mobile || 'N/A'}`);
        console.log('');
      });
    });

    console.log('🎯 Login Test Suggestions:');
    console.log('='.repeat(50));
    
    const patient = allUsers.find(u => u.role === 'patient');
    if (patient) {
      console.log(`👤 Patient: ${patient.email} (${patient.firstName} ${patient.lastName})`);
    }
    
    const doctor = allUsers.find(u => u.role === 'doctor');
    if (doctor) {
      console.log(`👨‍⚕️ Doctor: ${doctor.email} (${doctor.firstName} ${doctor.lastName})`);
    }
    
    const admin = allUsers.find(u => u.role === 'admin');
    if (admin) {
      console.log(`👑 Admin: ${admin.email} (${admin.firstName} ${admin.lastName})`);
    }

  } catch (error) {
    console.error('❌ Error showing users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

showAllUsers();
