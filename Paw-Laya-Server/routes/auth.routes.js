import express from 'express';
import {
  registerUser,
  loginUser,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetPassword,
  logOut,
} from '../controllers/auth.controller.js';
import userAuth from '../middlewares/authenticateToken.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import { authorizeUser } from '../middlewares/authMidlleWare.js';

const route = express.Router();

route.post('/registerUser', registerUser);

route.post('/login', loginUser);
route.post('/send-verify-otp', authenticateToken, sendVerifyOtp);
route.post('/verify-otp', authenticateToken, verifyOtp);
route.post('/send-reset-otp', authenticateToken, sendResetOtp);
route.post('/reset-password', authenticateToken, resetPassword);
route.post('/logout', authenticateToken, logOut);

export default route;
