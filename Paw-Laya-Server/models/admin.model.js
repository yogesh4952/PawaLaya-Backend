import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
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

    phonenumber: {
      type: Number,
      required: [true, 'Phone Number is required'],
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

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
