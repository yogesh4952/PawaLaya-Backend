import express from 'express';
import {
  deleteUser,
  getAllUser,
  getUser,
  loginAdmin,
  logOut,
  registerAdmin,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyOtp,
} from '../controllers/admin.controller.js';
import { authorizeAdmin } from '../middlewares/authMidlleWare.js';
import authenticateToken from '../middlewares/authenticateToken.js';
const route = express.Router();

route.get('/:id', authenticateToken, authorizeAdmin, getUser);
route.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);
route.get('/', authenticateToken, authorizeAdmin, getAllUser);

route.post('/login', loginAdmin);
route.post('/register', registerAdmin);
route.post('/send-verify-otp', authenticateToken, sendVerifyOtp);
route.post('/verify-otp', authenticateToken, verifyOtp);
route.post('/send-reset-otp', authenticateToken, sendResetOtp);
route.post('/reset-password', authenticateToken, resetPassword);
route.post('/logout', authenticateToken, logOut);

export default route;
