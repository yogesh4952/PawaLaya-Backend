import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.models.js';
import generateOtp from '../helper/generateOtp.js';
import sendEmail from '../helper/sendMail.js';
import userValidationSchema from '../helper/joi_validation.js';

dotenv.config();

// For user registration
const registerUser = async (req, res) => {
  const { username, email, password, phonenumber, role, fullname, address } =
    req.body;

  if (
    !username ||
    !email ||
    !password ||
    !phonenumber ||
    !role ||
    !fullname ||
    !address
  ) {
    return res.status(400).json({
      message: 'Bad request. Missing required fields.',
    });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({
      message: 'Username or email already exists.',
    });
  }

  const hashedPw = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPw,
    address: address.trim(),
    phonenumber,
    fullname: fullname.trim(),
    role,
  });

  try {
    await newUser.save();
    return res.status(201).json({
      message: 'User registered successfully.',
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
      error: error.message,
    });
  }
};

// Generate JWT token
const generateJWTToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.SECRET_STRING, { expiresIn: '2h' });
};

// For user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: 'User not found.',
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Incorrect password.',
      });
    }

    const token = generateJWTToken(existingUser);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).json({
      message: 'Login successful.',
      data: existingUser,
      token,
      success: true,
    });
  } catch (error) {
    return res.json({
      message: 'Internal server erro',
      error: error.message,
    });
  }
};

// Send OTP for account verification
const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'User doesn’t exist in the database.',
      });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: 'Account is already verified.',
      });
    }

    const otp = generateOtp();
    user.verifyOtp = otp;
    user.verifyOtpExpriesAt = Date.now() + 24 * 60 * 60 * 1000;

    try {
      await user.save();
      await sendEmail(
        user.email,
        'Welcome to Pawalaya',
        `<h1>Your OTP is ${otp}</h1><p>Welcome to PawaLaya!</p>`
      );
    } catch (mailError) {
      console.log(mailError);
      return res.json({
        messsage: 'Mail error',
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: 'OTP sent successfully.',
      otp,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
      error: error.message,
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { otp, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !otp) {
    return res.json({
      message: 'Invalid input.',
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: 'Account is already verified.',
      });
    }

    if (otp !== user.verifyOtp) {
      return res.json({
        message: 'OTP doesn’t match.',
        success: false,
      });
    }

    if (user.verifyOtpExpriesAt < Date.now()) {
      return res.json({
        message: 'OTP is expired.',
      });
    }

    user.verifyOtpExpriesAt = null;
    user.verifyOtp = '';
    user.isAccountVerified = true;

    await user.save();

    return res.json({
      message: 'Email verified successfully.',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
      error: error.message,
    });
  }
};

// Send OTP for password reset

const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: 'User not found in the database.',
      });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

    try {
      await user.save();
      await sendEmail(
        user.email,
        'Welcome to Pawalaya',
        `<h1>Your OTP is ${otp}</h1><p>Reset your password!</p>`
      );
    } catch (mailError) {
      console.error('Error sending email:', mailError.message);
      return res.status(500).json({
        message: 'Failed to send reset OTP .',
        success: false,
        error: mailError.message,
      });
    }

    return res.json({
      message: 'OTP sent successfully.',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
      error: error.message,
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !newPassword || !otp) {
      return res.json({
        message: 'All fields are required.',
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: 'User not found.',
        success: false,
      });
    }

    if (otp !== user.resetOtp) {
      return res.json({
        message: 'OTP doesn’t match.',
      });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({
        message: 'OTP expired.',
        success: false,
      });
    }

    const hashedNewPw = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPw;
    await user.save();

    return res.json({
      message: 'Password reset successfully.',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
      error: error.message,
    });
  }
};

const logOut = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.json({
      thau: 'Logout',
      message: 'All fields are required',
    });
  }

  if (password !== confirmPassword) {
    return res.json({
      message: 'Password and confirmPassword should be same',
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: 'User not found',
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.json({
        message: "Password doesn't match",
      });
    }

    res.clearCookie('authToken', {
      httpOnly: true,
    });

    return res.json({
      success: true,
      message: 'User logout succesfully',
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      error: error.message,
      message: 'Cannot logout',
    });
  }
};

export {
  resetPassword,
  sendResetOtp,
  verifyOtp,
  sendVerifyOtp,
  loginUser,
  registerUser,
  logOut,
};
