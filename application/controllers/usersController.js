// controlers/usersController.js

const usersModel = require('../models/usersModel');

// Handle user registration
exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;
    // Call model to create a new user
    usersModel.createUser({ username, email, password }, (err, result) => {
        if (err) {
            return res.status(500).send('Error creating user');
        }
        res.status(201).send('User registered successfully');
    });
};

// Handle user login
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    usersModel.findUserByEmail(email, (err, user) => {
        if (err || !user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }
        res.status(200).send('Login successful');
    });
};

// Retrieve user profile by ID
exports.getUserProfile = (req, res) => {
    const userId = req.params.id;
    usersModel.findUserById(userId, (err, user) => {
        if (err || !user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    });
};
