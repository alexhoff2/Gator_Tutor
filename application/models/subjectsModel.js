// models/subjectsModel.js

const db = require('../config/db'); // Ensure database connection works

const Subjects = {
    getAllSubjects: (callback) => {
        const query = 'SELECT * FROM subjects'; // Check if 'subjects' table exists and has data
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching subjects:", err);
                return callback(err);
            }
            console.log("Subjects fetched from the database:", results); // Log the result
            callback(null, results); // Pass results to the controller
        });
    }
};

module.exports = Subjects;
