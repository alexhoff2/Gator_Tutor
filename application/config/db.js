// config/db.js
// This file is the database configuration file. It creates a connection to the MySQL database using the mysql2 package and environment variables. The connection is exported so it can be used in other files. This file is required in the app.js file to establish a connection to the database when the application starts.

const mysql = require('mysql2'); // Use mysql2 for async support
require('dotenv').config(); // Load environment variables

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the MySQL database!');
});

module.exports = db; // Export the connection
