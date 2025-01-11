const express = require('express');
const {
  registerUser,
  loginUser,
  SendverifyOtp,
  verifyOtp,
} = require('../controllers/auth.controller');
const userAuth = require('../middlewares/UserAuth.middleware');
const { verify } = require('jsonwebtoken');
const route = express.Router();

route.post('/registerUser', registerUser);
route.post('/login', userAuth, loginUser);
route.post('/send-verify-otp', userAuth, SendverifyOtp);
route.post('/verify-otp', userAuth, verifyOtp);

module.exports = route;
