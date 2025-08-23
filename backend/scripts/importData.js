const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import the Donor model
const { Donor } = require('../src/models/donor.model');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hemocare');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Clean and transform CSV data
const cleanCSVData = (data) => {
  try {
    const cleanData = {};
    
    Object.keys(data).forEach(key => {
      let value = data[key];
      
      // Remove quotes if present
      if (typeof value === 'string') {
        value = value.replace(/^["']|["']$/g, '');
      }
      
      // Skip empty values for optional fields
      if (value === '' || value === 'null' || value === 'undefined') {
        value = undefined;
      }
      
      cleanData[key] = value;
    });

    // Transform the data to match our schema
    const transformedData = {
      userId: cleanData.user_id,
      bridgeId: cleanData.bridge_id || undefined,
      role: cleanData.role,
      roleStatus: cleanData.role_status === 'true',
      bridgeStatus: cleanData.bridge_status === 'true',
      bloodGroup: cleanData.blood_group,
      gender: cleanData.gender,
      latitude: parseFloat(cleanData.latitude),
      longitude: parseFloat(cleanData.longitude),
      bridgeGender: cleanData.bridge_gender || undefined,
      bridgeBloodGroup: cleanData.bridge_blood_group || undefined,
      quantityRequired: parseInt(cleanData.quantity_required) || 0,
      lastTransfusionDate: cleanData.last_transfusion_date ? new Date(cleanData.last_transfusion_date) : undefined,
      expectedNextTransfusionDate: cleanData.expected_next_transfusion_date ? new Date(cleanData.expected_next_transfusion_date) : undefined,
      registrationDate: new Date(cleanData.registration_date),
      donorType: cleanData.donor_type,
      lastContactedDate: cleanData.last_contacted_date ? new Date(cleanData.last_contacted_date) : undefined,
      lastDonationDate: cleanData.last_donation_date ? new Date(cleanData.last_donation_date) : undefined,
      nextEligibleDate: cleanData.next_eligible_date ? new Date(cleanData.next_eligible_date) : undefined,
      donationsTillDate: parseInt(cleanData.donations_till_date) || 0,
      eligibilityStatus: cleanData.eligibility_status,
      cycleOfDonations: parseInt(cleanData.cycle_of_donations) || 0,
      totalCalls: parseInt(cleanData.total_calls) || 0,
      frequencyInDays: parseInt(cleanData.frequency_in_days) || 0,
      statusOfBridge: cleanData.status_of_bridge || '',
      status: cleanData.status,
      donatedEarlier: cleanData.donated_earlier === 'true',
      lastBridgeDonationDate: cleanData.last_bridge_donation_date ? new Date(cleanData.last_bridge_donation_date) : undefined,
      callsToDonationsRatio: parseFloat(cleanData.calls_to_donations_ratio) || 0,
      userDonationActiveStatus: cleanData.user_donation_active_status === 'true',
      inactiveTriggerComment: cleanData.inactive_trigger_comment || undefined
    };

    // Validate required fields
    if (!transformedData.userId || !transformedData.role || !transformedData.bloodGroup || !transformedData.gender) {
      return null; // Skip invalid records
    }

    return transformedData;
    
  } catch (error) {
    console.error('Error cleaning CSV data:', error);
    return null;
  }
};

// Import CSV data
const importCSVData = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    let validRecords = 0;
    let invalidRecords = 0;
    
    console.log(`📁 Reading CSV file: ${filePath}`);
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const cleanedData = cleanCSVData(data);
        if (cleanedData) {
          results.push(cleanedData);
          validRecords++;
        } else {
          invalidRecords++;
        }
      })
      .on('end', async () => {
        try {
          console.log(`📊 Processing complete:`);
          console.log(`   ✅ Valid records: ${validRecords}`);
          console.log(`   ❌ Invalid records: ${invalidRecords}`);
          console.log(`   📝 Total records: ${validRecords + invalidRecords}`);
          
          if (results.length === 0) {
            reject(new Error('No valid records found in CSV'));
            return;
          }

          // Clear existing donor data (optional)
          console.log('🗑️  Clearing existing donor data...');
          await Donor.deleteMany({});
          
          // Insert the cleaned data
          console.log('💾 Inserting donor records into database...');
          const insertedDocs = await Donor.insertMany(results);
          
          console.log(`✅ Successfully imported ${insertedDocs.length} donor records`);
          
          resolve({
            success: true,
            message: `Successfully imported ${insertedDocs.length} donor records`,
            count: insertedDocs.length,
            validRecords,
            invalidRecords
          });
          
        } catch (error) {
          reject({
            success: false,
            message: `Error inserting data: ${error.message}`,
            count: 0,
            validRecords,
            invalidRecords
          });
        }
      })
      .on('error', (error) => {
        reject({
          success: false,
          message: `Error reading CSV: ${error.message}`,
          count: 0,
          validRecords: 0,
          invalidRecords: 0
        });
      });
  });
};

// Main function
const main = async () => {
  try {
    console.log('🚀 Starting data import process...');
    
    // Connect to database
    await connectDB();
    
    // Path to CSV file (relative to project root)
    const csvFilePath = path.join(__dirname, '../../Hackathon Data.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ CSV file not found: ${csvFilePath}`);
      console.log('💡 Make sure the CSV file is in the project root directory');
      process.exit(1);
    }
    
    // Import data
    const result = await importCSVData(csvFilePath);
    
    console.log('\n🎉 Data import completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Total imported: ${result.count}`);
    console.log(`   Valid records: ${result.validRecords}`);
    console.log(`   Invalid records: ${result.invalidRecords}`);
    
    // Get some statistics
    const totalDonors = await Donor.countDocuments();
    const activeDonors = await Donor.countDocuments({ status: 'active' });
    const eligibleDonors = await Donor.countDocuments({ eligibilityStatus: 'eligible' });
    
    console.log(`\n📈 Database Statistics:`);
    console.log(`   Total donors: ${totalDonors}`);
    console.log(`   Active donors: ${activeDonors}`);
    console.log(`   Eligible donors: ${eligibleDonors}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Data import failed:', error.message);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { importCSVData, cleanCSVData };
