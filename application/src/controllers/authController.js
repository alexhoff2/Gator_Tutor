const { getPool } = require("../config/db");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const SubjectsModel = require("../models/subjectsModel");

// Render register Page
exports.getregisterPage = async (req, res) => {
  console.log("authController.getregisterPage called");
  try {
    const subjects = await SubjectsModel.getAllSubjects();
    res.render("register", { subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle register Form Submission
exports.postregisterForm = [
  // Validation Middleware
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value) => {
      if (!value.endsWith("@sfsu.edu") && !value.endsWith("@mail.sfsu.edu")) {
        throw new Error("Email must be an SFSU email");
      }
      return true;
    }),
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Render Login Page
exports.getLoginPage = (req, res) => {
  console.log("authController.getLoginPage called");
  res.render("login");
};

// Handle Login Form Submission
exports.postLoginForm = [
  // Validation middleware
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value) => {
      if (!value.endsWith("@sfsu.edu") && !value.endsWith("@mail.sfsu.edu")) {
        throw new Error("Email must be an SFSU email");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    console.log("authController.postLoginForm async function called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    try {
      const pool = await getPool(); // Get the pool

      // Find user by email
      const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      const user = users[0];

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Set user session
      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };

      res.redirect("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(400).render("login", {
        errors: [{ msg: error.message }],
      });
    }
  },
];

exports.postRegisterForm = async (req, res) => {
  try {
    const { username, email, password, role, subjects } = req.body;
    // ... existing code to handle registration ...

    if (role === "tutor") {
      const tutorPost = {
        user_id: newUser.id,
        bio: req.body.bio,
        availability: req.body.availability,
        hourly_rate: req.body.hourly_rate,
        contact_info: req.body.contact_info,
      };
      const newTutorPost = await TutorPostsModel.create(tutorPost);

      // Save subjects to tutor_subjects table
      const subjectNames = subjects.split(",");
      for (const subjectName of subjectNames) {
        const [subject] = await db.query(
          "SELECT id FROM subjects WHERE subject_name = ?",
          [subjectName.trim()]
        );
        if (subject.length > 0) {
          await db.query(
            "INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (?, ?)",
            [newTutorPost.id, subject[0].id]
          );
        }
      }
    }

    res.redirect("/login");
  } catch (error) {
    console.log("Registration error:", error.message);
    res.status(400).render("register", { errors: [{ msg: error.message }] });
  }
};
