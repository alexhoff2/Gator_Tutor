const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET register Page
router.get("/auth/getregisterPage", authController.getregisterPage);

// POST register Form
router.post("/register", authController.postregisterForm);

// GET Login Page
router.get("/login", authController.getLoginPage);

// POST Login Form
router.post("/login", authController.postLoginForm);

// GET Logout
router.get("/logout", (req, res) => {
  console.log("GET /logout");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

module.exports = router;
