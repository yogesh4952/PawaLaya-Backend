const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('User', UserSchema);
