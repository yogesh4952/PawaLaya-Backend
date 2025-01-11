const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const route = express.Router();

route.post('/registerUser', registerUser);
route.post('/login', loginUser);

module.exports = route;
