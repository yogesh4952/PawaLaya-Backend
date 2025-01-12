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
import userAuth from '../middlewares/UserAuth.middleware.js';
import deleteAll from '../controllers/deleteAll.js';

const route = express.Router();

route.post('/registerUser', registerUser);
route.post('/login', loginUser);
route.post('/send-verify-otp', userAuth, sendVerifyOtp);
route.post('/verify-otp', userAuth, verifyOtp);
route.post('/send-reset-otp', userAuth, sendResetOtp);
route.post('/reset-password', userAuth, resetPassword);
route.post('/logout', userAuth, logOut);

route.delete('/', deleteAll);

export default route;
