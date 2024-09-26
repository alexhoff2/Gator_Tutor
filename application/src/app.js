// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const usersRoutes = require('./routes/usersRoute');
const subjectsController = require('./controllers/subjectsController');

const app = express(); // Create the express app

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fetch subjects for dropdown in every request
// app.use(subjectsController.fetchAllSubjects);

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', usersRoutes);

// Define team members data
const teamMembers = {
  'alex-hoff': {
      name: 'Alex Hoff',
      title: 'Team Lead',
      img: '/images/Alexander-Hoff.png',
      bio: 'Alex oversees the entire project, coordinates between team members, ensures everyone is aligned on the project goals, and makes key decisions related to progress and direction.'
  },
  'austin-ng': {
      name: 'Austin Ng',
      title: 'Backend Lead',
      img: '/images/Austin-Ng.png',
      bio: 'Austin focuses on the server-side development, including managing databases, server logic, APIs, and the overall architecture that powers the functionality of the project.'
  },
  'jack-richards': {
      name: 'Jack Richards',
      title: 'Front-End',
      img: '/images/Jack-Richards.png',
      bio: 'Works on the client side, responsible for implementing the visual and interactive aspects of the project. This includes designing and coding the user interface to ensure it\'s user-friendly and responsive.'
  },
  'dylan-lee': {
      name: 'Dylan Lee',
      title: 'GitHub Master',
      img: '/images/Dylan-Lee.png',
      bio: 'Manages the version control system (GitHub), ensuring proper collaboration between team members, handling code merges, pull requests, and resolving any conflicts that arise in the codebase.'
  },
  'dalan-moore': {
      name: 'Dalan Moore',
      title: 'Front-End',
      img: '/images/Dalan-Moore.png',
      bio: 'Dalan works on the front-end team, focusing on clean design and smooth interactions.'
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs file
});

app.get('/about', (req, res) => {
  res.render('about'); // Render the about.ejs file
});

app.get('/:memberId', (req, res) => {
  const memberId = req.params.memberId.toLowerCase();
  const member = teamMembers[memberId];

  if (member) {
      res.render('member', { member: member });
  } else {
      res.status(404).render('404'); // Ensure you have a '404.ejs' template
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app; // Export the app so it can be used in index.js.