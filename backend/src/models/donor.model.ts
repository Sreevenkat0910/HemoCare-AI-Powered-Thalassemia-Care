import mongoose, { Document, Schema } from 'mongoose';

export interface IDonor extends Document {
  userId: string;
  bridgeId?: string;
  role: 'Emergency Donor' | 'Bridge Donor' | 'Volunteer';
  roleStatus: boolean;
  bridgeStatus: boolean;
  bloodGroup: string;
  gender: 'Male' | 'Female';
  latitude: number;
  longitude: number;
  bridgeGender?: 'Male' | 'Female';
  bridgeBloodGroup?: string;
  quantityRequired: number;
  lastTransfusionDate?: Date;
  expectedNextTransfusionDate?: Date;
  registrationDate: Date;
  donorType: 'One-Time Donor' | 'Regular Donor' | 'Other';
  lastContactedDate?: Date;
  lastDonationDate?: Date;
  nextEligibleDate?: Date;
  donationsTillDate: number;
  eligibilityStatus: 'eligible' | 'not eligible';
  cycleOfDonations: number;
  totalCalls: number;
  frequencyInDays: number;
  statusOfBridge: string;
  status: 'active' | 'inactive';
  donatedEarlier: boolean;
  lastBridgeDonationDate?: Date;
  callsToDonationsRatio: number;
  userDonationActiveStatus: boolean;
  inactiveTriggerComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donorSchema = new Schema<IDonor>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  bridgeId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Emergency Donor', 'Bridge Donor', 'Volunteer']
  },
  roleStatus: {
    type: Boolean,
    required: true
  },
  bridgeStatus: {
    type: Boolean,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A Positive', 'A Negative', 'B Positive', 'B Negative', 'AB Positive', 'AB Negative', 'O Positive', 'O Negative']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  bridgeGender: {
    type: String,
    enum: ['Male', 'Female']
  },
  bridgeBloodGroup: {
    type: String,
    enum: ['A Positive', 'A Negative', 'B Positive', 'B Negative', 'AB Positive', 'AB Negative', 'O Positive', 'O Negative']
  },
  quantityRequired: {
    type: Number,
    required: true,
    min: 0
  },
  lastTransfusionDate: {
    type: Date
  },
  expectedNextTransfusionDate: {
    type: Date
  },
  registrationDate: {
    type: Date,
    required: true
  },
  donorType: {
    type: String,
    required: true,
    enum: ['One-Time Donor', 'Regular Donor', 'Other']
  },
  lastContactedDate: {
    type: Date
  },
  lastDonationDate: {
    type: Date
  },
  nextEligibleDate: {
    type: Date
  },
  donationsTillDate: {
    type: Number,
    required: true,
    min: 0
  },
  eligibilityStatus: {
    type: String,
    required: true,
    enum: ['eligible', 'not eligible']
  },
  cycleOfDonations: {
    type: Number,
    required: true,
    min: 0
  },
  totalCalls: {
    type: Number,
    required: true,
    min: 0
  },
  frequencyInDays: {
    type: Number,
    required: true,
    min: 0
  },
  statusOfBridge: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive']
  },
  donatedEarlier: {
    type: Boolean,
    required: true
  },
  lastBridgeDonationDate: {
    type: Date
  },
  callsToDonationsRatio: {
    type: Number,
    required: true,
    min: 0
  },
  userDonationActiveStatus: {
    type: Boolean,
    required: true
  },
  inactiveTriggerComment: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
donorSchema.index({ bloodGroup: 1, gender: 1 });
donorSchema.index({ latitude: 1, longitude: 1 });
donorSchema.index({ eligibilityStatus: 1 });
donorSchema.index({ status: 1 });
donorSchema.index({ lastDonationDate: 1 });
donorSchema.index({ nextEligibleDate: 1 });

// Virtual for full name (if we want to add it later)
donorSchema.virtual('fullName').get(function() {
  return `${this.gender} - ${this.bloodGroup}`;
});

// Method to check if donor is currently eligible
donorSchema.methods.isCurrentlyEligible = function(): boolean {
  if (this.eligibilityStatus === 'not eligible') return false;
  if (this.nextEligibleDate && new Date() < this.nextEligibleDate) return false;
  return true;
};

// Method to get days until next eligible
donorSchema.methods.getDaysUntilEligible = function(): number {
  if (!this.nextEligibleDate) return 0;
  const now = new Date();
  const diffTime = this.nextEligibleDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const Donor = mongoose.model<IDonor>('Donor', donorSchema);
