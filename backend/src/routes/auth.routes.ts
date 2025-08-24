import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const router = Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isISO8601().toDate().withMessage('Date of birth is required'),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Valid blood group is required'),
  body('height').isNumeric().withMessage('Height must be a number'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  body('hemoglobin').isNumeric().withMessage('Hemoglobin must be a number'),
  body('ironLevel').isNumeric().withMessage('Iron level must be a number'),
  body('heartRate').isNumeric().withMessage('Heart rate must be a number'),
  body('bloodPressure.systolic').isNumeric().withMessage('Systolic blood pressure must be a number'),
  body('bloodPressure.diastolic').isNumeric().withMessage('Diastolic blood pressure must be a number')
];

// Patient registration
router.post('/register', validateRegistration, async (req: any, res: any) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      email, password, firstName, lastName, gender, phone, dateOfBirth,
      bloodGroup, height, weight, hemoglobin, ironLevel, heartRate,
      bloodPressure, emergencyContact, address, medicalHistory
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate user_id
    const userCount = await User.countDocuments();
    const user_id = `P${String(userCount + 1).padStart(3, '0')}`;

    // Create new patient
    const patient = await User.create({
      user_id,
      email,
      password,
      firstName,
      lastName,
      gender,
      phone,
      dateOfBirth,
      bloodGroup,
      height,
      weight,
      hemoglobin,
      ironLevel,
      heartRate,
      bloodPressure,
      emergencyContact,
      address,
      medicalHistory,
      role: 'patient'
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: patient._id, email: patient.email, role: patient.role },
      (process.env["JWT_SECRET"] || 'fallback_secret') as string,
      { expiresIn: (process.env["JWT_EXPIRES_IN"] || '24h') as any }
    );

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        user: patient.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unified login for all user types
router.post('/login', validateLogin, async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      (process.env["JWT_SECRET"] || 'fallback_secret') as string,
      { expiresIn: (process.env["JWT_EXPIRES_IN"] || '24h') as any }
    );

    // Prepare user data for response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      bloodGroup: user.bloodGroup,
      gender: user.gender,
      mobile: user.mobile,
      city: user.city,
      pincode: user.pincode,
      donorType: user.donorType,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current patient profile
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, (process.env["JWT_SECRET"] || 'fallback_secret') as string) as any;
    const patient = await User.findById(decoded.userId);
    
    if (!patient || !patient.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Patient not found or inactive'
      });
    }

    const patientResponse = {
      _id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      role: patient.role,
      email: patient.email,
      bloodGroup: patient.bloodGroup,
      gender: patient.gender,
      mobile: patient.mobile,
      city: patient.city,
      pincode: patient.pincode,
      donorType: patient.donorType,
      isActive: patient.isActive,
      lastLogin: patient.lastLogin,
      dateOfBirth: patient.dateOfBirth
    };

    res.json({
      success: true,
      data: {
        user: patientResponse
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
