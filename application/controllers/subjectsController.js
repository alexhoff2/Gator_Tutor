// controllers/subjectsController.js

const Subjects = require('../models/subjectsModel');

// Middleware to fetch all subjects and make them available in the views
exports.fetchAllSubjects = (req, res, next) => {
    Subjects.getAllSubjects((err, subjects) => {
        if (err) {
            console.error("Error fetching subjects:", err);
            return next(err); // Pass the error to the next middleware if any
        }
        res.locals.subjects = subjects; // Make 'subjects' available globally in all views
        next(); // Proceed to the next middleware or route handler
    });
};
