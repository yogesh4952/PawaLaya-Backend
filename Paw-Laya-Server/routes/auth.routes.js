import express from 'express';
import {
  registerUser,
  loginUser,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetPassword,
} from '../controllers/auth.controller.js';
import userAuth from '../middlewares/UserAuth.middleware.js';

const route = express.Router();

route.post('/registerUser', registerUser);
route.post('/login', loginUser);
route.post('/send-verify-otp', userAuth, sendVerifyOtp);
route.post('/verify-otp', userAuth, verifyOtp);
route.post('/send-reset-otp', userAuth, sendResetOtp);
route.post('/reset-password', userAuth, resetPassword);

export default route;
