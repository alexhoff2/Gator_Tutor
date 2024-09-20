// routes/usersRoute.js

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route for rendering registration page
router.get('/register', usersController.renderRegisterPage);

// Route for handling user registration form submission
router.post('/register', usersController.registerUser);

module.exports = router;
