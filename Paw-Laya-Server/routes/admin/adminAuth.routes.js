// routes/admin.auth.routes.js
import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import authorizeRoles from '../../middlewares/checkRole.js';
import {
  registerAdmin,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetPassword,
  logOut,
  loginAdmin,
} from '../../controllers/admin/admin.auth.controllers.js';

const route = express.Router();

// Authentication routes
route.post('/login', loginAdmin);
route.post('/register', registerAdmin);

// Admin-specific routes, protected with authenticateToken and authorizeRoles
route.post(
  '/send-verify-otp',
  authenticateToken,
  authorizeRoles('admin'), // Corrected usage
  sendVerifyOtp
);
route.post(
  '/verify-otp',
  authenticateToken,
  authorizeRoles('admin'), // Corrected usage
  verifyOtp
);
route.post('/send-reset-otp', authorizeRoles('admin'), sendResetOtp);
route.post('/reset-password', authorizeRoles('admin'), resetPassword);
route.post('/logout', authenticateToken, authorizeRoles('admin'), logOut);

export default route;
