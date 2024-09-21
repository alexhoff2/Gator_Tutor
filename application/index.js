// index.js

const app = require('./app'); // Import the configured Express app
const db = require('./config/db'); // Import the centralized database connection
require('dotenv').config(); // Load environment variables

// Middleware to make `db` accessible in all routes
// app.use((req, res, next) => {
//     req.db = db;
//     next();
// });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
