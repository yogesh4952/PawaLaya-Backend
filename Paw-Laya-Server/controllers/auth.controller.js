require('dotenv').config();
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailer');
const { default: mongoose } = require('mongoose');
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format.',
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
const generateJWTToken = async (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.SECRET_STRING, { expiresIn: '2h' });
};

// For user login
const loginUser = async (req, res) => {
  const { emailorUsername, password } = req.body;

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Regex for password validation (e.g., at least 6 characters, including one number and one letter)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!emailorUsername || !password) {
    return res.status(400).json({
      message: 'All fields are required.',
    });
  }

  let existingUser;
  if (emailRegex.test(emailorUsername)) {
    // If the input is an email, search for the user by email
    existingUser = await User.findOne({ email: emailorUsername });
  } else {
    // If the input is not an email, assume it's a username and search by username
    existingUser = await User.findOne({ username: emailorUsername });
  }

  if (!existingUser) {
    return res.status(400).json({
      message: 'User not found.',
      success: false,
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'Incorrect password.',
    });
  }

  const token = await generateJWTToken(existingUser);

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
};

const SendverifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    //Checking the condition

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.json({
        success: false,
        message: 'User doesnt exist in db',
      });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        text: 'isAccountVerified check garne nirako',
        msg: 'Account is already verified',
      });
    }

    //? Otp generation

    const otp = crypto.randomInt(100000, 999999);
    user.verifyOtp = otp;
    user.verifyOtpExpriesAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: user.email, // Recipient address
      subject: 'Welcome to PawaLaya!', // Subject line
      html: `
       <h1>Your otp is ${user.verifyOtp} </h1>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Welcome to PawaLaya!</h2>
          <p style="color: #555; line-height: 1.5;">Hello <strong>${user.fullname}</strong>,</p>
          <p style="color: #555; line-height: 1.5;">We are excited to have you on board. Your account has been successfully created. You can now start exploring our platform.</p>
          <p style="color: #555; line-height: 1.5;">Thank you for joining us!</p>
          <p style="color: #555; font-size: 14px;">If you have any questions, feel free to reach out to us.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://pawalaya.com" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit PawaLaya</a>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return res.json({
      success: true,
      message: 'Otp sent succesfully',
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

const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const { userId } = req.body;
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(userId) || !otp) {
    return res.json({
      message: 'Invalid input',
      text: ' Verify otp wala',
    });
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        text: 'isAccountVerified check garne nirako',
        msg: 'Account is already verified',
      });
    }

    if (otp !== user.verifyOtp) {
      return res.json({
        message: "Otp doesn't match",
        success: false,
      });
    }

    if (user.verifyOtpExpriesAt < Date.now()) {
      return res.json({
        message: 'Otp is expired',
      });
    }

    user.verifyOtpExpriesAt = null;
    user.verifyOtp = '';
    user.isAccountVerified = true;

    await user.save();

    const mailOptions = {
      from: 'no-reply@pawalaya.com', // Your email
      to: user.email, // The recipient's email
      subject: '🎉 Your Account Has Been Verified!',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                font-size: 24px;
                color: #4CAF50;
                margin-bottom: 20px;
              }
              .content {
                font-size: 16px;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">🎉 Congratulations! Your Account is Verified</div>
              <div class="content">
                <p>Hi ${user.fullname},</p>
                <p>Your account has been successfully verified, and you can now enjoy all the amazing features of PawaLaya!</p>
                <p>If you have any questions or need assistance, feel free to <a href="mailto:support@pawalaya.com">contact us</a>.</p>
                <a href="https://pawalaya.com" class="button">Go to PawaLaya</a>
              </div>
              <div class="footer">
                <p>Thank you for being part of the PawaLaya community.</p>
                <p>If you did not verify your account, please ignore this message or <a href="mailto:support@pawalaya.com">contact support</a>.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      message: 'EMail verified succesfully',
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: 'User not found in the database.',
      });
    }

    const otp = crypto.randomInt(100000, 999999);
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL, // Replace with your app's support email
      to: email, // Recipient's email
      subject: `Reset Your Password - ${otp}`, // Email subject
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; padding: 10px;">
          <h1 style="color: #4CAF50; margin-bottom: 0;">Pawlaya</h1>
          <p style="color: #888888; font-size: 14px;">Secure Your Account</p>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333333;">Hi there,</p>
          <p style="font-size: 14px; color: #555555; line-height: 1.5;">
            We received a request to reset the password for your account. Use the OTP below to proceed with resetting your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <h2 style="color: #4CAF50; font-size: 32px; margin: 0;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #555555; line-height: 1.5;">
            This OTP is valid for <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.
          </p>
          <p style="font-size: 14px; color: #555555;">Need help? <a href="mailto:support@yourapp.com" style="color: #4CAF50; text-decoration: none;">Contact Support</a></p>
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f9f9f9; border-top: 1px solid #eaeaea; border-radius: 0 0 8px 8px;">
          <p style="font-size: 12px; color: #aaaaaa;">You received this email because a password reset request was made for your account.</p>
          <p style="font-size: 12px; color: #aaaaaa;">© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    transporter.sendMail(mailOptions);

    return res.json({
      message: 'Otp sent succesfully',
      otp,
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

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !newPassword || !otp) {
      return res.json({
        message: 'All fields are required',
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: 'User not found',
        success: false,
      });
    }

    if (otp !== user.resetOtp) {
      return res.json({
        message: 'Otp not matched',
      });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({
        message: 'Otp expired',
        success: false,
      });
    }

    const hashedNewPw = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPw;
    await user.save();

    return res.json({
      message: 'password reset succesfully',
      success: true,
    });

    // const newPassword = await bcrypt.hash(newPassword, 10);
  } catch (error) {}
};

module.exports = {
  registerUser,
  loginUser,
  SendverifyOtp,
  verifyOtp,
  sendResetOtp,
  resetPassword,
};
