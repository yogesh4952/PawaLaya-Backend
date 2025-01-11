const mongoose = require('mongoose');

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
      required: [true, 'Username is required'],
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
      enum: ['seller', 'adopter'],
      required: [true, 'You must specified the role'],
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

module.exports = mongoose.model('User', UserSchema);
