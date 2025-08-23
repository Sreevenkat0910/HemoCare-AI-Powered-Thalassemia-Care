import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { Donor, IDonor } from '../models/donor.model';

export class DataImportService {
  
  /**
   * Import CSV data into MongoDB
   */
  static async importCSVData(filePath: string): Promise<{ success: boolean; message: string; count: number }> {
    try {
      const results: any[] = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            // Clean and transform the data
            const cleanedData = this.cleanCSVData(data);
            if (cleanedData) {
              results.push(cleanedData);
            }
          })
          .on('end', async () => {
            try {
              // Clear existing data (optional - you might want to keep it)
              // await Donor.deleteMany({});
              
              // Insert the cleaned data
              const insertedDocs = await Donor.insertMany(results);
              
              resolve({
                success: true,
                message: `Successfully imported ${insertedDocs.length} donor records`,
                count: insertedDocs.length
              });
            } catch (error) {
              reject({
                success: false,
                message: `Error inserting data: ${error}`,
                count: 0
              });
            }
          })
          .on('error', (error) => {
            reject({
              success: false,
              message: `Error reading CSV: ${error}`,
              count: 0
            });
          });
      });
      
    } catch (error) {
      throw new Error(`CSV import failed: ${error}`);
    }
  }

  /**
   * Clean and transform CSV data to match our schema
   */
  private static cleanCSVData(data: any): any {
    try {
      // Remove quotes and clean up the data
      const cleanData: any = {};
      
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
  }

  /**
   * Get donor statistics
   */
  static async getDonorStatistics(): Promise<any> {
    try {
      const stats = await Donor.aggregate([
        {
          $group: {
            _id: null,
            totalDonors: { $sum: 1 },
            activeDonors: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            eligibleDonors: { $sum: { $cond: [{ $eq: ['$eligibilityStatus', 'eligible'] }, 1, 0] } },
            emergencyDonors: { $sum: { $cond: [{ $eq: ['$role', 'Emergency Donor'] }, 1, 0] } },
            bridgeDonors: { $sum: { $cond: [{ $eq: ['$role', 'Bridge Donor'] }, 1, 0] } },
            volunteers: { $sum: { $cond: [{ $eq: ['$role', 'Volunteer'] }, 1, 0] } }
          }
        }
      ]);

      const bloodGroupStats = await Donor.aggregate([
        {
          $group: {
            _id: '$bloodGroup',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const genderStats = await Donor.aggregate([
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 }
          }
        }
      ]);

      return {
        overall: stats[0] || {},
        bloodGroups: bloodGroupStats,
        gender: genderStats
      };
      
    } catch (error) {
      throw new Error(`Error getting donor statistics: ${error}`);
    }
  }

  /**
   * Find eligible donors by blood group and location
   */
  static async findEligibleDonors(
    bloodGroup: string,
    latitude: number,
    longitude: number,
    maxDistance: number = 50 // km
  ): Promise<IDonor[]> {
    try {
      // Find donors within the specified distance
      const donors = await Donor.find({
        bloodGroup,
        eligibilityStatus: 'eligible',
        status: 'active'
      });

      // Filter by distance (simple calculation - you might want to use a more sophisticated geospatial query)
      const eligibleDonors = donors.filter(donor => {
        const distance = this.calculateDistance(
          latitude, longitude,
          donor.latitude, donor.longitude
        );
        return distance <= maxDistance;
      });

      // Sort by distance and eligibility
      return eligibleDonors.sort((a, b) => {
        const distanceA = this.calculateDistance(latitude, longitude, a.latitude, a.longitude);
        const distanceB = this.calculateDistance(latitude, longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
      });

    } catch (error) {
      throw new Error(`Error finding eligible donors: ${error}`);
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
