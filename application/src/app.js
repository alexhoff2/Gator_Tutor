console.log("Loading app.js");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const usersRoutes = require("./routes/usersRoute");
const authRoutes = require("./routes/authRoute");
const tutorsRoute = require("./routes/tutorsRoute");
const messagesRoutes = require("./routes/messagesRoute");

const { ensureAuthenticated } = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const { fetchAllSubjects } = require("./controllers/subjectsController");

const app = express(); // Create the express app

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to set user in locals
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Use the logger middleware
app.use(logger);

// Use the fetchAllSubjects middleware
app.use(fetchAllSubjects);

// Routes
app.use("/", usersRoutes);
app.use("/", authRoutes);

// Use Tutors Route
app.use("/tutors", tutorsRoute);

// Use Messages Route
app.use("/messages", messagesRoutes);

// Define team members data
const teamMembers = {
  "alex-hoff": {
    name: "Alex Hoff",
    title: "Team Lead",
    img: "/images/Alexander-Hoff.png",
    bio: "Alex oversees the entire project, coordinates between team members, ensures everyone is aligned on the project goals, and makes key decisions related to progress and direction.",
  },
  "austin-ng": {
    name: "Austin Ng",
    title: "Backend Lead",
    img: "/images/Austin-Ng.png",
    bio: "Austin focuses on the server-side development, including managing databases, server logic, APIs, and the overall architecture that powers the functionality of the project.",
  },
  "jack-richards": {
    name: "Jack Richards",
    title: "Front-End",
    img: "/images/Jack-Richards.png",
    bio: "Works on the client side, responsible for implementing the visual and interactive aspects of the project. This includes designing and coding the user interface to ensure it's user-friendly and responsive.",
  },
  "dylan-lee": {
    name: "Dylan Lee",
    title: "GitHub Master",
    img: "/images/Dylan-Lee.png",
    bio: "Manages the version control system (GitHub), ensuring proper collaboration between team members, handling code merges, pull requests, and resolving any conflicts that arise in the codebase.",
  },
  "dalan-moore": {
    name: "Dalan Moore",
    title: "Front-End",
    img: "/images/Dalan-Moore.png",
    bio: "Dalan works on the front-end team, focusing on clean design and smooth interactions.",
  },
};

// Routes
app.get("/", (req, res) => {
  console.log("GET /");
  res.render("index", { user: req.session.user }); // Pass user info to the view
});

app.get("/about", (req, res) => {
  console.log("GET /about");
  res.render("about", { user: req.session.user }); // Pass user info to the view
});

app.get("/:memberId", (req, res) => {
  const memberId = req.params.memberId.toLowerCase();
  const member = teamMembers[memberId];
  console.log(`GET /${memberId}`);

  if (member) {
    res.render("member", { member: member, user: req.session.user }); // Pass user info to the view
  } else {
    res.status(404).render("404", { user: req.session.user }); // Ensure you have a '404.ejs' template
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Add this after setting up your routes
console.log(
  "Registered routes:",
  app._router.stack.filter((r) => r.route).map((r) => r.route.path)
);

module.exports = app; // Export the app so it can be used in index.js.
