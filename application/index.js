const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const tutorRoutes = require('./routes/tutors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // MySQL username
    password: '1234',       // Your MySQL password
    database: 'tutoring_app'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error: ', err);
        return;
    }
    console.log('Connected to the database!');
});

// Middleware to make `db` accessible in all routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/tutors', tutorRoutes);

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
