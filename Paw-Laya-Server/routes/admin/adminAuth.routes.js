// Init router
// import express from 'express';
// import authenticateToken from '../../middlewares/authenticateToken.js';
import {
  registerAdmin,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetPassword,
  logOut,
  loginAdmin,
} from '../../controllers/admin/admin.auth.controllers.js';
import authenticateToken from '../../middlewares/authenticateToken.js';

import express from 'express';
const route = express.Router();
//Authentication
route.post('/login', loginAdmin);
route.post('/register', registerAdmin);
route.post('/send-verify-otp', authenticateToken, sendVerifyOtp);
route.post('/verify-otp', authenticateToken, verifyOtp);
route.post('/send-reset-otp', sendResetOtp);
route.post('/reset-password', resetPassword);
route.post('/logout', authenticateToken, logOut);

export default route;
