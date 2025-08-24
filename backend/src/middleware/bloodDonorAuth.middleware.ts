import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BloodDonor } from '../models/bloodDonor.model';

// Extend Express Request interface to include blood donor
declare global {
  namespace Express {
    interface Request {
      bloodDonor?: any;
    }
  }
}

export const bloodDonorAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('=== BLOOD DONOR AUTH MIDDLEWARE ===');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token ? token.substring(0, 20) + '...' : 'No token');

    if (!token) {
      console.log('No token provided');
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Verify token using the same secret as blood donor routes
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    console.log('JWT_SECRET:', JWT_SECRET);
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('Decoded token:', decoded);
    
    // Find blood donor
    console.log('Looking for donor with ID:', decoded.donorId);
    const bloodDonor = await BloodDonor.findById(decoded.donorId);
    console.log('Blood donor found:', bloodDonor ? 'Yes' : 'No');
    
    if (!bloodDonor) {
      console.log('Donor not found in database');
      res.status(401).json({
        success: false,
        message: 'Token is invalid or donor not found.'
      });
      return;
    }

    // Add blood donor to request object
    req.bloodDonor = bloodDonor;
    console.log('Middleware successful, proceeding to route');
    next();
  } catch (error) {
    console.error('Middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};
