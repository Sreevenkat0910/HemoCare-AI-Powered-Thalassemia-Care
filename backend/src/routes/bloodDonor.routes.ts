import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BloodDonor } from '../models/bloodDonor.model';
import { bloodDonorAuthMiddleware } from '../middleware/bloodDonorAuth.middleware';
import mongoose from 'mongoose'; // Added for raw collection access

const router = express.Router();

// Debug: Check what model we're using
console.log('🔍 BloodDonor model imported:', !!BloodDonor);
console.log('🔍 BloodDonor model name:', BloodDonor?.modelName);
console.log('🔍 BloodDonor collection name:', BloodDonor?.collection?.name);

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Register new blood donor
router.post('/register', async (req, res) => {
  try {
    const { email, password, ...donorData } = req.body;

    // Check if donor already exists
    const existingDonor = await BloodDonor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor with this email already exists' });
    }

    // Generate unique IDs
    const user_id = `D${Math.floor(Math.random() * 1000) + 100}`;
    const bridge_id = `B${Math.floor(Math.random() * 1000) + 100}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new donor with generated IDs and default values
    const newDonor = new BloodDonor({
      ...donorData,
      email,
      password: hashedPassword,
      user_id,
      bridge_id,
      role: 'donor',
      latitude: donorData.latitude || 17.3922792, // Default to Hyderabad coordinates
      longitude: donorData.longitude || 78.4602749, // Default to Hyderabad coordinates
      quantity_required: donorData.quantity_required || 0,
      donations_till_date: 0,
      eligibility_status: 'pending_verification',
      cycle_of_donations: 0,
      frequency_in_days: 0,
      status_of_bridge: 'good',
      donated_earlier: false,
      calls_to_donations_ratio: 0,
      total_calls: 0,
      last_contacted_date: new Date(),
      registration_date: new Date(),
      role_status: 'active',
      status: 'active',
      user_donation_active_status: 'active'
    });

    await newDonor.save();

    res.status(201).json({ 
      message: 'Donor registered successfully',
      donor: {
        user_id: newDonor.user_id,
        email: newDonor.email,
        blood_group: newDonor.blood_group,
        donor_type: newDonor.donor_type
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login blood donor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Debug logging
    console.log('🔍 Blood Donor Login Attempt:');
    console.log('Email:', email);
    console.log('Password received:', !!password);
    console.log('Password length:', password ? password.length : 0);

    // Debug database connection
    console.log('🔍 Database connection status:');
    console.log('- Mongoose connected:', mongoose.connection.readyState === 1);
    console.log('- Database name:', mongoose.connection.db?.databaseName);
    console.log('- Database host:', mongoose.connection.host);
    console.log('- Database port:', mongoose.connection.port);

    // Try using raw collection first to bypass model issues
    const db = req.app.locals.db || mongoose.connection.db;
    console.log('🔍 Using database:', db?.databaseName);
    
    // List available collections
    const collections = await db.listCollections().toArray();
    console.log('🔍 Available collections:', collections.map(c => c.name));
    
    const bloodDonorsCollection = db.collection('blood_donors');
    console.log('🔍 Blood donors collection:', bloodDonorsCollection.collectionName);
    
    // Find donor by email using raw collection
    const donor = await bloodDonorsCollection.findOne({ email });
    console.log('Donor found in raw collection:', !!donor);
    
    if (donor) {
      console.log('Donor details found:');
      console.log('- Email:', donor.email);
      console.log('- User ID:', donor.user_id);
      console.log('- Password hash length:', donor.password ? donor.password.length : 'No password');
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, donor.password);
      console.log('Password match:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Password validation failed');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      console.log('✅ Password validation successful');
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          donorId: donor._id, 
          email: donor.email,
          user_id: donor.user_id 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        donor: {
          user_id: donor.user_id,
          bridge_id: donor.bridge_id,
          email: donor.email,
          blood_group: donor.blood_group,
          donor_type: donor.donor_type,
          role: donor.role,
          gender: donor.gender,
          latitude: donor.latitude,
          longitude: donor.longitude,
          quantity_required: donor.quantity_required,
          last_transfusion_date: donor.last_transfusion_date,
          expected_next_transfusion_date: donor.expected_next_transfusion_date,
          registration_date: donor.registration_date,
          last_donation_date: donor.last_donation_date,
          next_eligible_date: donor.next_eligible_date,
          donations_till_date: donor.donations_till_date,
          eligibility_status: donor.eligibility_status,
          role_status: donor.role_status,
          status: donor.status,
          user_donation_active_status: donor.user_donation_active_status,
          cycle_of_donations: donor.cycle_of_donations,
          frequency_in_days: donor.frequency_in_days,
          status_of_bridge: donor.status_of_bridge,
          donated_earlier: donor.donated_earlier,
          last_bridge_donation_date: donor.last_bridge_donation_date,
          calls_to_donations_ratio: donor.calls_to_donations_ratio,
          total_calls: donor.total_calls,
          last_contacted_date: donor.last_contacted_date,
          inactive_trigger_comment: donor.inactive_trigger_comment,
          // Add firstName and lastName for dashboard compatibility
          firstName: 'Blood',
          lastName: 'Donor'
        }
      });
      
    } else {
      console.log('❌ Donor not found in database');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get donor profile (protected route)
router.get('/profile', bloodDonorAuthMiddleware, async (req, res) => {
  try {
    console.log('=== PROFILE ROUTE HANDLER ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers received:', req.headers);
    
    // The donor is already verified by the middleware
    const donor = req.bloodDonor;
    console.log('Donor found:', donor ? 'Yes' : 'No');

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Remove password from response
    const donorProfile = donor.toObject();
    delete donorProfile.password;

    res.json(donorProfile);

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test route without middleware to debug
router.get('/test-auth', async (req, res) => {
  try {
    console.log('=== TEST AUTH ROUTE ===');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    console.log('JWT_SECRET:', JWT_SECRET);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Decoded token:', decoded);
      
      const bloodDonor = await BloodDonor.findById(decoded.donorId);
      console.log('Blood donor found:', bloodDonor ? 'Yes' : 'No');
      
      if (bloodDonor) {
        res.json({ 
          message: 'Token is valid', 
          donorId: decoded.donorId,
          email: bloodDonor.email 
        });
      } else {
        res.status(404).json({ message: 'Donor not found in database' });
      }
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      res.status(401).json({ message: 'JWT verification failed', error: jwtError.message });
    }
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update donor profile (protected route)
router.put('/profile', bloodDonorAuthMiddleware, async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedDonor = await BloodDonor.findByIdAndUpdate(
      req.bloodDonor._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Remove password from response
    const donorProfile = updatedDonor.toObject();
    delete donorProfile.password;

    res.json(donorProfile);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all donors (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const donors = await BloodDonor.find({}, '-password');
    res.json(donors);
  } catch (error) {
    console.error('Get all donors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get nearby donors based on location
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const nearbyDonors = await BloodDonor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
          },
          $maxDistance: parseFloat(maxDistance as string) * 1000 // Convert km to meters
        }
      }
    }, '-password').limit(20);

    res.json(nearbyDonors);

  } catch (error) {
    console.error('Nearby donors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update donor eligibility status
router.patch('/:donorId/eligibility', async (req, res) => {
  try {
    const { donorId } = req.params;
    const { eligibility_status, next_eligible_date } = req.body;

    const updatedDonor = await BloodDonor.findByIdAndUpdate(
      donorId,
      { eligibility_status, next_eligible_date },
      { new: true, runValidators: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(updatedDonor);

  } catch (error) {
    console.error('Eligibility update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

