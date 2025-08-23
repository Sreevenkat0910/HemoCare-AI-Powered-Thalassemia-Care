import express from 'express';
import { DataImportService } from '../services/dataImport.service';
import { Donor } from '../models/donor.model';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Get all donors (with pagination and filtering)
router.get('/', authMiddleware, async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const bloodGroup = req.query.bloodGroup;
    const status = req.query.status;
    const eligibilityStatus = req.query.eligibilityStatus;
    const role = req.query.role;

    // Build filter object
    const filter: any = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (status) filter.status = status;
    if (eligibilityStatus) filter.eligibilityStatus = eligibilityStatus;
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const [donors, total] = await Promise.all([
      Donor.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Donor.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: donors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donors',
      error: error.message
    });
  }
});

// Get donor by ID
router.get('/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      data: donor
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donor',
      error: error.message
    });
  }
});

// Get donor statistics
router.get('/stats/overview', authMiddleware, async (req: any, res: any) => {
  try {
    const stats = await DataImportService.getDonorStatistics();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donor statistics',
      error: error.message
    });
  }
});

// Find eligible donors by blood group and location
router.post('/search/eligible', authMiddleware, async (req: any, res: any) => {
  try {
    const { bloodGroup, latitude, longitude, maxDistance = 50 } = req.body;

    if (!bloodGroup || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Blood group, latitude, and longitude are required'
      });
    }

    const eligibleDonors = await DataImportService.findEligibleDonors(
      bloodGroup,
      latitude,
      longitude,
      maxDistance
    );

    res.json({
      success: true,
      data: eligibleDonors,
      count: eligibleDonors.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching for eligible donors',
      error: error.message
    });
  }
});

// Import CSV data (Admin only)
router.post('/import/csv', authMiddleware, async (req: any, res: any) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    const result = await DataImportService.importCSVData(filePath);

    res.json({
      success: true,
      message: result.message,
      count: result.count
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error importing CSV data',
      error: error.message
    });
  }
});

// Update donor status
router.patch('/:id/status', authMiddleware, async (req: any, res: any) => {
  try {
    const { status, eligibilityStatus, nextEligibleDate } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (eligibilityStatus) updateData.eligibilityStatus = eligibilityStatus;
    if (nextEligibleDate) updateData.nextEligibleDate = new Date(nextEligibleDate);

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      message: 'Donor updated successfully',
      data: donor
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating donor',
      error: error.message
    });
  }
});

// Delete donor (Admin only)
router.delete('/:id', authMiddleware, async (req: any, res: any) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      message: 'Donor deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting donor',
      error: error.message
    });
  }
});

export default router;
