const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { BloodDonor } = require('../dist/models/bloodDonor.model.js');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemocare_db';

// 5 selected donors from the CSV with diverse blood groups and types
const selectedDonors = [
  {
    // Emergency Donor - A+ Male
    user_id: "DONOR_20250101_001",
    bridge_id: "BRIDGE_20250101_001",
    role: "donor",
    role_status: "active",
    bridge_status: "inactive",
    blood_group: "A+",
    gender: "male",
    latitude: 17.3922792,
    longitude: 78.4602749,
    bridge_gender: null,
    bridge_blood_group: null,
    quantity_required: 0,
    last_transfusion_date: null,
    expected_next_transfusion_date: null,
    registration_date: new Date("2020-04-18"),
    donor_type: "emergency-donor",
    last_contacted_date: new Date("2025-07-28"),
    last_donation_date: new Date("2025-08-17"),
    next_eligible_date: new Date("2025-11-15"),
    donations_till_date: 9,
    eligibility_status: "not_eligible",
    cycle_of_donations: 90,
    total_calls: 3,
    frequency_in_days: 0,
    status_of_bridge: "good",
    status: "active",
    donated_earlier: true,
    last_bridge_donation_date: null,
    calls_to_donations_ratio: 0.33,
    user_donation_active_status: "active",
    inactive_trigger_comment: null,
    email: "john.emergency@example.com",
    password: "password123"
  },
  {
    // Bridge Donor - O+ Male
    user_id: "DONOR_20250101_002",
    bridge_id: "BRIDGE_20250101_002",
    role: "donor",
    role_status: "active",
    bridge_status: "active",
    blood_group: "O+",
    gender: "male",
    latitude: 17.3922792,
    longitude: 78.4602749,
    bridge_gender: "male",
    bridge_blood_group: "O+",
    quantity_required: 1,
    last_transfusion_date: new Date("2025-08-02"),
    expected_next_transfusion_date: new Date("2025-08-23"),
    registration_date: new Date("2020-05-02"),
    donor_type: "bridge-donor",
    last_contacted_date: new Date("2025-07-26"),
    last_donation_date: new Date("2025-07-28"),
    next_eligible_date: new Date("2025-10-26"),
    donations_till_date: 3,
    eligibility_status: "not_eligible",
    cycle_of_donations: 90,
    total_calls: 3,
    frequency_in_days: 21,
    status_of_bridge: "optimal",
    status: "active",
    donated_earlier: true,
    last_bridge_donation_date: new Date("2025-08-02"),
    calls_to_donations_ratio: 1.00,
    user_donation_active_status: "active",
    inactive_trigger_comment: null,
    email: "mike.bridge@example.com",
    password: "password123"
  },
  {
    // Emergency Donor - B+ Female
    user_id: "DONOR_20250101_003",
    bridge_id: "BRIDGE_20250101_003",
    role: "donor",
    role_status: "active",
    bridge_status: "inactive",
    blood_group: "B+",
    gender: "female",
    latitude: 17.3922792,
    longitude: 78.4602749,
    bridge_gender: null,
    bridge_blood_group: null,
    quantity_required: 0,
    last_transfusion_date: null,
    expected_next_transfusion_date: null,
    registration_date: new Date("2020-04-17"),
    donor_type: "emergency-donor",
    last_contacted_date: new Date("2025-07-24"),
    last_donation_date: new Date("2020-11-28"),
    next_eligible_date: new Date("2021-03-28"),
    donations_till_date: 1,
    eligibility_status: "not_eligible",
    cycle_of_donations: 120,
    total_calls: 15,
    frequency_in_days: 0,
    status_of_bridge: "good",
    status: "active",
    donated_earlier: true,
    last_bridge_donation_date: null,
    calls_to_donations_ratio: 15.00,
    user_donation_active_status: "inactive",
    inactive_trigger_comment: "Very limited activity despite multiple calls",
    email: "sarah.emergency@example.com",
    password: "password123"
  },
  {
    // Bridge Donor - AB+ Male
    user_id: "DONOR_20250101_004",
    bridge_id: "BRIDGE_20250101_004",
    role: "donor",
    role_status: "active",
    bridge_status: "active",
    blood_group: "AB+",
    gender: "male",
    latitude: 17.3922792,
    longitude: 78.4602749,
    bridge_gender: "female",
    bridge_blood_group: "AB+",
    quantity_required: 1,
    last_transfusion_date: new Date("2025-07-26"),
    expected_next_transfusion_date: new Date("2025-08-20"),
    registration_date: new Date("2020-05-14"),
    donor_type: "bridge-donor",
    last_contacted_date: new Date("2025-08-13"),
    last_donation_date: new Date("2025-01-09"),
    next_eligible_date: new Date("2025-04-09"),
    donations_till_date: 10,
    eligibility_status: "eligible",
    cycle_of_donations: 90,
    total_calls: 3,
    frequency_in_days: 25,
    status_of_bridge: "optimal",
    status: "active",
    donated_earlier: true,
    last_bridge_donation_date: new Date("2025-07-26"),
    calls_to_donations_ratio: 0.30,
    user_donation_active_status: "active",
    inactive_trigger_comment: null,
    email: "david.abpositive@example.com",
    password: "password123"
  },
  {
    // Volunteer - O+ Male
    user_id: "DONOR_20250101_005",
    bridge_id: "BRIDGE_20250101_005",
    role: "donor",
    role_status: "active",
    bridge_status: "inactive",
    blood_group: "O+",
    gender: "male",
    latitude: 17.3922792,
    longitude: 78.4602749,
    bridge_gender: null,
    bridge_blood_group: null,
    quantity_required: 0,
    last_transfusion_date: null,
    expected_next_transfusion_date: null,
    registration_date: new Date("2020-04-20"),
    donor_type: "volunteer",
    last_contacted_date: new Date("2025-06-03"),
    last_donation_date: new Date("2025-07-03"),
    next_eligible_date: new Date("2025-10-01"),
    donations_till_date: 6,
    eligibility_status: "not_eligible",
    cycle_of_donations: 90,
    total_calls: 4,
    frequency_in_days: 0,
    status_of_bridge: "good",
    status: "active",
    donated_earlier: true,
    last_bridge_donation_date: null,
    calls_to_donations_ratio: 0.67,
    user_donation_active_status: "active",
    inactive_trigger_comment: null,
    email: "alex.volunteer@example.com",
    password: "password123"
  }
];

async function importDonors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing donors (optional - remove this if you want to keep existing data)
    await BloodDonor.deleteMany({});
    console.log('🗑️  Cleared existing donors');

    // Hash passwords and create donors
    const donorsWithHashedPasswords = await Promise.all(
      selectedDonors.map(async (donor) => {
        const hashedPassword = await bcrypt.hash(donor.password, 10);
        return {
          ...donor,
          password: hashedPassword
        };
      })
    );

    // Insert donors into database
    const result = await BloodDonor.insertMany(donorsWithHashedPasswords);
    console.log(`✅ Successfully imported ${result.length} donors`);

    // Display imported donors
    console.log('\n📋 Imported Donors:');
    result.forEach((donor, index) => {
      console.log(`${index + 1}. ${donor.email} - ${donor.blood_group} - ${donor.donor_type}`);
    });

    console.log('\n🔑 Login Credentials:');
    console.log('All donors use password: password123');
    console.log('\n📧 Emails:');
    selectedDonors.forEach(donor => {
      console.log(`- ${donor.email}`);
    });

  } catch (error) {
    console.error('❌ Error importing donors:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the import
importDonors();
