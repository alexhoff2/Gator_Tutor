// app.js

const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoute');
const path = require('path');
require('dotenv').config();

const app = express(); // Create the express app

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.use('/users', usersRoutes);

// Serve home page
app.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs file
});
// Serve about page
app.get('/about', (req, res) => {
  res.render('about'); // Render the about.ejs file
});

module.exports = app; // Export the app so it can be used in index.js
