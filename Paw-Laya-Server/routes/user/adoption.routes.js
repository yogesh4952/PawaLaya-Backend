// routes/adoptionRoutes.js
import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
const router = express.Router();
import {
  updateApplicationStatus,
  applyForAdoption,
  getUserApplications,
} from '../../controllers/user/adoptionApplication.controllers.js';
// User can apply for adoption

router.post('/apply', authenticateToken, applyForAdoption);

// User can view their own applications
router.get('/my-applications', authenticateToken, getUserApplications);

// Admin can update application status
router.patch('/:id/status', authenticateToken, updateApplicationStatus);

export default router;
