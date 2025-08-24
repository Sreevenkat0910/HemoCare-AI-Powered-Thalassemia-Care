import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IPatient extends Document {
  // Basic Information
  user_id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone: string;
  
  // Medical Information
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height: number; // cm
  weight: number; // kg
  
  // Health Metrics
  hemoglobin: number; // g/dL
  ironLevel: number; // µg/dL
  heartRate: number; // bpm
  bloodPressure: {
    systolic: number; // mmHg
    diastolic: number; // mmHg
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  
  // Medical History
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    surgeries: string[];
    familyHistory: string[];
  };
  
  // Status and Dates
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: Date;
  lastVisit: Date;
  
  // Role and Permissions
  role: 'patient' | 'doctor' | 'admin';
  isActive: boolean;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getFullName(): string;
  getAge(): number;
  getBMI(): number;
  getHealthStatus(): {
    hemoglobin: 'low' | 'normal' | 'high';
    ironLevel: 'low' | 'normal' | 'high';
    heartRate: 'low' | 'normal' | 'high';
    bloodPressure: 'normal' | 'high';
  };
}

const patientSchema = new Schema<IPatient>({
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
  
  // Emergency Contact
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
  
  // Status and Dates
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
  } catch (error: any) {
    next(error);
  }
});

// Instance methods
patientSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

patientSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

patientSchema.methods.getAge = function(): number {
  if (!this.dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

patientSchema.methods.getBMI = function(): number {
  if (!this.height || !this.weight) return 0;
  const heightInMeters = this.height / 100;
  return Number((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
};

patientSchema.methods.getHealthStatus = function() {
  const status = {
    hemoglobin: 'normal' as 'low' | 'normal' | 'high',
    ironLevel: 'normal' as 'low' | 'normal' | 'high',
    heartRate: 'normal' as 'low' | 'normal' | 'high',
    bloodPressure: 'normal' as 'normal' | 'high'
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
};

// Virtuals
patientSchema.virtual('fullName').get(function() {
  return this.getFullName();
});

patientSchema.virtual('age').get(function() {
  return this.getAge();
});

patientSchema.virtual('bmi').get(function() {
  return this.getBMI();
});

patientSchema.virtual('healthStatus').get(function() {
  return this.getHealthStatus();
});

// Indexes for better performance
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

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);
export default Patient;


