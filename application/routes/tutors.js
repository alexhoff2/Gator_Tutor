// routes/tutors.js
const express = require('express');
const router = express.Router();

// Example route to add a tutor
router.post('/', (req, res) => {
    const { user_id, expertise, hourly_rate, availability } = req.body;
    const query = `INSERT INTO Tutors (user_id, expertise, hourly_rate, availability) VALUES (?, ?, ?, ?)`;

    req.db.query(query, [user_id, expertise, hourly_rate, availability], (err, result) => {
        if (err) {
            res.status(500).send('Error adding tutor');
        } else {
            res.send('Tutor added successfully');
        }
    });
});

// Export the router
module.exports = router;
