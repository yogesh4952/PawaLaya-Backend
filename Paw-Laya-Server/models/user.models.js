import mongoose from 'mongoose';
import userValidationSchema from '../helper/joi_validation.js';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      minlength: [3, 'Username must be at least 3 characters long'], // Minimum length of 3
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'], // Minimum length of 6
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    fullname: {
      type: String,
      required: [true, 'FullName is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phonenumber: {
      type: Number,
      required: [true, 'Phone Number is required'],
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },

    verifyOtp: {
      type: Number,
      default: '',
    },

    verifyOtpExpriesAt: {
      type: Number,
      default: 0,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    resetOtp: {
      type: String,
      default: ' ',
    },

    resetOtpExpiresAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;
