import User from '../models/user.models.js';
import Admin from '../models/admin.model.js';
import generateJwt from '../helper/generateJwt.js';
import bcrypt from 'bcrypt';
import generateOtp from '../helper/generateOtp.js';
import sendEmail from '../helper/sendMail.js';
import mongoose from 'mongoose';

const registerAdmin = async (req, res) => {
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

  //Restrict registration for admin
  if (role === 'user') {
    return res.json({
      message: 'Invalid role',
    });
  }

  //restriction to create more admin
  const count = await Admin.countDocuments();
  if (count > 1) {
    return res.json({
      message: 'Only one admin is allowed',
    });
  }

  //check either user exist or not
  const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
  if (existingAdmin) {
    return res.status(400).json({
      message: 'Username or email already exists.',
    });
  }

  //hashing the pw for security
  const hashedPw = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({
    username,
    email,
    password: hashedPw,
    address: address.trim(),
    phonenumber,
    fullname: fullname.trim(),
    role,
  });

  try {
    await newAdmin.save();
    return res.status(201).json({
      message: 'admin registered successfully.',
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

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check either it is empty or not

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required.',
      });
    }

    //search for existingAdmin or not
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.status(400).json({
        message: 'Admin not found.',
        success: false,
      });
    }

    //check either password is correct or not
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    //applying condition for password doesn't match

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Incorrect password.',
      });
    }

    //generating token for establishing session
    const token = generateJwt(existingAdmin);

    //cookie generating
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Login successful.',
      data: existingAdmin,
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

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.json({
        success: false,
        message: 'User doesn’t exist in the database.',
      });
    }

    if (admin.isAccountVerified) {
      return res.json({
        success: false,
        message: 'Account is already verified.',
      });
    }

    const otp = generateOtp();
    admin.verifyOtp = otp;
    admin.verifyOtpExpriesAt = Date.now() + 24 * 60 * 60 * 1000;

    try {
      await admin.save();
      await sendEmail(
        admin.email,
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
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.json({
        success: false,
        message: 'User not found.',
      });
    }

    if (admin.isAccountVerified) {
      return res.json({
        success: false,
        message: 'Account is already verified.',
      });
    }

    if (otp !== admin.verifyOtp) {
      return res.json({
        message: 'OTP doesn’t match.',
        success: false,
      });
    }

    if (admin.verifyOtpExpriesAt < Date.now()) {
      return res.json({
        message: 'OTP is expired.',
      });
    }

    admin.verifyOtpExpriesAt = null;
    admin.verifyOtp = '';
    admin.isAccountVerified = true;

    await admin.save();

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

const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({
        message: 'Admin not found in the database.',
      });
    }

    const otp = generateOtp();
    admin.resetOtp = otp;
    admin.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

    try {
      await admin.save();
      await sendEmail(
        admin.email,
        'Welcome to Pawalaya',
        `<h1>Your OTP is ${otp}</h1><p>Reset your password!</p>`
      );
    } catch (mailError) {
      console.error('Error sending email:', mailError.message);
      return res.status(500).json({
        message: 'Failed to send reset OTP .',
        success: false,
        error: mailError.message,
        otp,
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

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({
        message: 'User not found.',
        success: false,
      });
    }

    if (otp !== admin.resetOtp) {
      return res.json({
        message: 'OTP doesn’t match.',
      });
    }

    if (admin.resetOtpExpiresAt < Date.now()) {
      return res.json({
        message: 'OTP expired.',
        success: false,
      });
    }

    const hashedNewPw = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPw;
    await admin.save();

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
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({
        message: 'User not found',
      });
    }

    const matchPassword = await bcrypt.compare(password, admin.password);
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
      message: 'Admin logout succesfully',
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

const deleteAll = async (req, res) => {
  try {
    const result = await User.deleteMany({}); // Delete all users

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    res.status(200).json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.json({
        message: "User doesn't exist.",
      });
    }
    const deleteUser = await User.findByIdAndDelete({ _id: id });
    return res.json({
      message: 'User deleted succesfully',
      data: deleteUser,
    });
  } catch (error) {}
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.json({
        message: 'User not found',
      });
    }

    return res.json({
      message: 'Succesfully get the details',
      data: user,
    });
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const data = await User.find({});
    if (!data) {
      return res.json({
        message: 'No user in the database',
      });
    }
    return res.json({
      data,
    });
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export {
  deleteAll,
  deleteUser,
  getUser,
  getAllUser,
  loginAdmin,
  registerAdmin,
  sendVerifyOtp,
  verifyOtp,
  logOut,
  resetPassword,
  sendResetOtp,
};
