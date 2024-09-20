// controlers/usersController.js

const usersModel = require('../models/usersModel');
const subjectsModel = require('../models/subjectsModel');

// Render the registration page and load subjects dynamically
exports.renderRegisterPage = (req, res) => {
    console.log("Fetching subjects in controller...");
    subjectsModel.getAllSubjects((err, subjects) => {
        if (err) {
            console.error("Error in fetching subjects:", err);
            return res.status(500).send('Error loading subjects');
        }
        console.log("Subjects passed to view:", subjects); // Check if this logs the subjects correctly
        res.render('register', { subjects });
    });
};


// Handle displaying the registration form
exports.showRegistrationForm = (req, res) => {
    subjectsModel.getAllSubjects((err, subjects) => {
        if (err) {
            return res.status(500).send('Error fetching subjects');
        }
        res.render('register', { subjects }); // Pass subjects to the view
    });
};

// Handle user registration
exports.registerUser = (req, res) => {
    const { username, email, password, role, expertise, hourly_rate, subjects } = req.body;

    const is_tutor = role === 'tutor' ? true : false;

    // Call the model to create a new user
    usersModel.create({
        username,
        email,
        password,
        role,
        is_tutor,
        expertise: is_tutor ? expertise : null, // Only include expertise if they're a tutor
        hourly_rate: is_tutor ? hourly_rate : null, // Only include rate if they're a tutor
        subjects
    }, (err, result) => {
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
