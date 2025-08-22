import { Router } from 'express';

const router = Router();

// Get doctor dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Doctor dashboard endpoint - to be implemented'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
