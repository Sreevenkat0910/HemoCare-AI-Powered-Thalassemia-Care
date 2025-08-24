const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemoDB';

// Comprehensive patient data structure
const patientData = [
  {
    // Basic Information
    user_id: 'P001',
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    phone: '+91 9876543210',
    
    // Medical Information
    bloodGroup: 'A+',
    height: 175, // cm
    weight: 70, // kg
    
    // Health Metrics
    hemoglobin: 8.2, // g/dL (low)
    ironLevel: 180, // µg/dL (high)
    heartRate: 82, // bpm (normal)
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
    
    // Address Information
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    
    // Medical History
    medicalHistory: {
      conditions: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin'],
      medications: ['Metformin', 'Amlodipine'],
      surgeries: ['Appendectomy - 2010'],
      familyHistory: ['Father: Heart Disease', 'Mother: Diabetes']
    },
    
    // Current Status
    status: 'active',
    registrationDate: new Date('2024-01-15'),
    lastVisit: new Date('2024-08-15'),
    
    // Role and Permissions
    role: 'patient',
    isActive: true
  },
  {
    // Basic Information
    user_id: 'P002',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    dateOfBirth: '1992-07-22',
    gender: 'female',
    phone: '+91 9876543212',
    
    // Medical Information
    bloodGroup: 'O-',
    height: 162,
    weight: 55,
    
    // Health Metrics
    hemoglobin: 12.5, // g/dL (normal)
    ironLevel: 85, // µg/dL (normal)
    heartRate: 75, // bpm (normal)
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
    
    // Address Information
    address: {
      street: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    
    // Medical History
    medicalHistory: {
      conditions: ['Asthma'],
      allergies: ['Dust', 'Pollen'],
      medications: ['Albuterol Inhaler'],
      surgeries: [],
      familyHistory: ['Mother: Asthma']
    },
    
    // Current Status
    status: 'active',
    registrationDate: new Date('2024-02-20'),
    lastVisit: new Date('2024-08-10'),
    
    // Role and Permissions
    role: 'patient',
    isActive: true
  },
  {
    // Basic Information
    user_id: 'P003',
    email: 'michael.chen@example.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: '1978-11-08',
    gender: 'male',
    phone: '+91 9876543214',
    
    // Medical Information
    bloodGroup: 'B+',
    height: 180,
    weight: 85,
    
    // Health Metrics
    hemoglobin: 15.2, // g/dL (normal)
    ironLevel: 95, // µg/dL (normal)
    heartRate: 88, // bpm (normal)
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
    
    // Address Information
    address: {
      street: '789 Pine Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    
    // Medical History
    medicalHistory: {
      conditions: ['High Cholesterol'],
      allergies: ['Shellfish'],
      medications: ['Atorvastatin'],
      surgeries: ['Knee Surgery - 2018'],
      familyHistory: ['Father: High Cholesterol', 'Mother: Hypertension']
    },
    
    // Current Status
    status: 'active',
    registrationDate: new Date('2024-03-10'),
    lastVisit: new Date('2024-08-12'),
    
    // Role and Permissions
    role: 'patient',
    isActive: true
  },
  {
    // Basic Information
    user_id: 'P004',
    email: 'emily.rodriguez@example.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    dateOfBirth: '1995-04-30',
    gender: 'female',
    phone: '+91 9876543216',
    
    // Medical Information
    bloodGroup: 'AB+',
    height: 168,
    weight: 62,
    
    // Health Metrics
    hemoglobin: 11.8, // g/dL (normal)
    ironLevel: 70, // µg/dL (normal)
    heartRate: 68, // bpm (normal)
    bloodPressure: {
      systolic: 110,
      diastolic: 70
    },
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Father',
      phone: '+91 9876543217',
      address: '321 Elm St, City'
    },
    
    // Address Information
    address: {
      street: '321 Elm Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      country: 'India'
    },
    
    // Medical History
    medicalHistory: {
      conditions: [],
      allergies: ['Latex'],
      medications: [],
      surgeries: [],
      familyHistory: ['Grandmother: Diabetes']
    },
    
    // Current Status
    status: 'active',
    registrationDate: new Date('2024-04-05'),
    lastVisit: new Date('2024-08-08'),
    
    // Role and Permissions
    role: 'patient',
    isActive: true
  },
  {
    // Basic Information
    user_id: 'P005',
    email: 'david.kumar@example.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Kumar',
    dateOfBirth: '1988-09-12',
    gender: 'male',
    phone: '+91 9876543218',
    
    // Medical Information
    bloodGroup: 'O+',
    height: 175,
    weight: 78,
    
    // Health Metrics
    hemoglobin: 9.5, // g/dL (low)
    ironLevel: 45, // µg/dL (low)
    heartRate: 95, // bpm (normal)
    bloodPressure: {
      systolic: 128,
      diastolic: 82
    },
    emergencyContact: {
      name: 'Priya Kumar',
      relationship: 'Sister',
      phone: '+91 9876543219',
      address: '654 Maple Dr, City'
    },
    
    // Address Information
    address: {
      street: '654 Maple Drive',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      country: 'India'
    },
    
    // Medical History
    medicalHistory: {
      conditions: ['Migraine'],
      allergies: ['Sulfa Drugs'],
      medications: ['Sumatriptan'],
      surgeries: ['Tonsillectomy - 2005'],
      familyHistory: ['Mother: Migraine']
    },
    
    // Current Status
    status: 'active',
    registrationDate: new Date('2024-05-18'),
    lastVisit: new Date('2024-08-14'),
    
    // Role and Permissions
    role: 'patient',
    isActive: true
  }
];

// Create Patient Schema
const patientSchema = new mongoose.Schema({
  // Basic Information
  user_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Medical Information
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    uppercase: true
  },
  height: {
    type: Number,
    min: 50,
    max: 250,
    required: true
  },
  weight: {
    type: Number,
    min: 20,
    max: 300,
    required: true
  },
  
  // Health Metrics
  hemoglobin: {
    type: Number,
    min: 5,
    max: 25,
    default: 14.0,
    required: true
  },
  ironLevel: {
    type: Number,
    min: 20,
    max: 300,
    default: 100,
    required: true
  },
  heartRate: {
    type: Number,
    min: 40,
    max: 200,
    default: 72,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      min: 70,
      max: 200,
      default: 120,
      required: true
    },
    diastolic: {
      type: Number,
      min: 40,
      max: 130,
      default: 80,
      required: true
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, 'Pincode must be 6 digits']
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India'
    }
  },
  
  // Medical History
  medicalHistory: {
    conditions: [{
      type: String,
      trim: true
    }],
    allergies: [{
      type: String,
      trim: true
    }],
    medications: [{
      type: String,
      trim: true
    }],
    surgeries: [{
      type: String,
      trim: true
    }],
    familyHistory: [{
      type: String,
      trim: true
    }]
  },
  
  // Current Status
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  
  // Role and Permissions
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'patients'
});

// Pre-save middleware to hash password
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
patientSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for BMI
patientSchema.virtual('bmi').get(function() {
  if (!this.height || !this.weight) return null;
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Virtual for health status
patientSchema.virtual('healthStatus').get(function() {
  const status = {
    hemoglobin: 'normal',
    ironLevel: 'normal',
    heartRate: 'normal',
    bloodPressure: 'normal'
  };
  
  // Hemoglobin status (12-16 g/dL is normal)
  if (this.hemoglobin < 12) status.hemoglobin = 'low';
  else if (this.hemoglobin > 16) status.hemoglobin = 'high';
  
  // Iron level status (60-170 µg/dL is normal)
  if (this.ironLevel < 60) status.ironLevel = 'low';
  else if (this.ironLevel > 170) status.ironLevel = 'high';
  
  // Heart rate status (60-100 bpm is normal)
  if (this.heartRate < 60) status.heartRate = 'low';
  else if (this.heartRate > 100) status.heartRate = 'high';
  
  // Blood pressure status (<140/90 is normal)
  if (this.bloodPressure.systolic >= 140 || this.bloodPressure.diastolic >= 90) {
    status.bloodPressure = 'high';
  }
  
  return status;
});

// Create indexes
patientSchema.index({ email: 1 });
patientSchema.index({ user_id: 1 });
patientSchema.index({ bloodGroup: 1 });
patientSchema.index({ city: 1 });
patientSchema.index({ status: 1 });

// Transform document when converting to JSON
patientSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const Patient = mongoose.model('Patient', patientSchema);

async function createPatientDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Patient.deleteMany({});
    console.log('🗑️  Cleared existing patient data');

    // Hash passwords and create patients
    console.log('🔐 Creating patients with hashed passwords...');
    const patientsToInsert = [];
    
    for (const patientInfo of patientData) {
      const patient = new Patient(patientInfo);
      await patient.save();
      patientsToInsert.push(patient);
    }

    console.log(`✅ Successfully created ${patientsToInsert.length} patients`);

    // Display summary
    console.log('\n📊 Patient Database Summary:');
    console.log(`Total patients: ${patientsToInsert.length}`);
    
    const bloodGroupCounts = {};
    const cityCounts = {};
    
    patientsToInsert.forEach(patient => {
      bloodGroupCounts[patient.bloodGroup] = (bloodGroupCounts[patient.bloodGroup] || 0) + 1;
      cityCounts[patient.address.city] = (cityCounts[patient.address.city] || 0) + 1;
    });
    
    console.log('\n🩸 Blood Group Distribution:');
    Object.entries(bloodGroupCounts).forEach(([bg, count]) => {
      console.log(`  ${bg}: ${count}`);
    });
    
    console.log('\n🏙️  City Distribution:');
    Object.entries(cityCounts).forEach(([city, count]) => {
      console.log(`  ${city}: ${count}`);
    });

    // Test login for first patient
    console.log('\n🧪 Testing login for first patient:');
    const testPatient = patientsToInsert[0];
    const testPassword = 'password123';
    const isValidPassword = await testPatient.comparePassword(testPassword);
    
    if (isValidPassword) {
      console.log(`✅ Login test successful for ${testPatient.fullName}`);
      console.log(`📧 Email: ${testPatient.email}`);
      console.log(`🔑 Password: ${testPassword}`);
    } else {
      console.log('❌ Login test failed');
    }

    console.log('\n🎉 Patient database creation completed successfully!');
    console.log('🔑 All patients can login with: password123');

  } catch (error) {
    console.error('❌ Error creating patient database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the creation
createPatientDatabase();
