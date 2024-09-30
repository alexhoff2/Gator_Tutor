const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Render register Page
exports.getregisterPage = async (req, res) => {
  console.log("authController.getregisterPage called");
  try {
    const [subjects] = await pool.query("SELECT * FROM subjects");
    res.render("register", { subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send("Server Error");
  }
};

// Handle register Form Submission
exports.postregisterForm = [
  (req, res, next) => {
    console.log("authController.postregisterForm middleware called");
    next();
  },
  // Validation Middleware
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/@sfsu\.edu$/)
    .withMessage("Email must be an SFSU email"),
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  async (req, res) => {
    console.log("authController.postregisterForm async function called");
    const errors = validationResult(req);
    const { role } = req.body; // Extract from body
    const { email, name, password } = req.body;

    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      const [allSubjects] = await pool.query("SELECT * FROM subjects");
      return res.status(400).render("register", {
        subjects: allSubjects,
        errors: errors.array(),
        formData: { email, name },
      });
    }

    try {
      // Check if email already exists
      const [existingUsers] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (existingUsers.length > 0) {
        throw new Error("Email already in use");
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert User
      const [result] = await pool.query(
        "INSERT INTO users (username, email, password, role, is_tutor) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, role, role === "tutor" ? 1 : 0]
      );

      const userId = result.insertId;

      // Store user info in session
      req.session.user = { id: userId, name, email, role };

      // Redirect based on role
      if (role === "tutor") {
        res.redirect("/become-a-tutor");
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      const [allSubjects] = await pool.query("SELECT * FROM subjects");
      res.status(500).render("register", {
        subjects: allSubjects,
        errors: [{ msg: error.message }],
        formData: { email, name },
      });
    }
  },
];

// Render Login Page
exports.getLoginPage = (req, res) => {
  console.log("authController.getLoginPage called");
  res.render("login");
};

// Handle Login Form Submission
exports.postLoginForm = [
  (req, res, next) => {
    console.log("authController.postLoginForm middleware called");
    next();
  },
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    console.log("authController.postLoginForm async function called");
    const errors = validationResult(req);
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password });

    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).render("login", { errors: errors.array() });
    }

    try {
      const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (users.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Store user info in session
      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };

      res.redirect("/");
    } catch (error) {
      console.log("Login error:", error.message);
      res.status(400).render("login", { errors: [{ msg: error.message }] });
    }
  },
];
