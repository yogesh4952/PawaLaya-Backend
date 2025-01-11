require('dotenv').config();
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// For user registration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Bad request. Missing username or email or password',
    });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({
      message: 'Username or email already exists',
    });
  }

  const hashedPw = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPw });

  try {
    // Save the new user and await the result
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

// Generate JWT token
const generateJWTToken = async function (user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = await jwt.sign(payload, process.env.SECRET_STRING, {
    expiresIn: '2h',
  });

  return token;
};

// For user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: 'Email is not registered yet',
        success: false,
      });
    }

    const comparePw = await bcrypt.compare(password, existingUser.password);

    if (!comparePw) {
      return res.status(400).json({
        message: 'Incorrect Password',
      });
    }

    const token = await generateJWTToken(existingUser);

    res.cookie('authToken', token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: 'Login successfully',
      data: existingUser,
      token,
      success: true,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      message: 'Login error. Internal server error',
      error: error.message,
      success: false,
    });
  }
};

module.exports = { registerUser, loginUser };
