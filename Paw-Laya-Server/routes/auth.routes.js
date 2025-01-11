const express = require('express');
const {
  registerUser,
  loginUser,
  SendverifyOtp,
  verifyOtp,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} = require('../controllers/auth.controller');
const userAuth = require('../middlewares/UserAuth.middleware');
const { verify } = require('jsonwebtoken');
const route = express.Router();

route.post('/registerUser', registerUser);
route.post('/login', userAuth, loginUser);
route.post('/send-verify-otp', userAuth, SendverifyOtp);
route.post('/verify-otp', userAuth, verifyOtp);
route.post('/send-reset-otp', userAuth, sendResetOtp);
route.post('/reset-password', userAuth, resetPassword);

module.exports = route;
