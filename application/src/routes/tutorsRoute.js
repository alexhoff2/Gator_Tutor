const express = require("express");
const router = express.Router();
const tutorsController = require("../controllers/tutorsController");
const subjectsController = require("../controllers/subjectsController");

// Debugging Logs
console.log("tutorsController:", tutorsController);
console.log("subjectsController:", subjectsController);

// GET /tutors
router.get(
  "/",
  subjectsController.fetchAllSubjects,
  tutorsController.listTutors
);

// Route to handle tutor profile page
router.get("/tutors/:id", tutorsController.getTutorProfile);

module.exports = router;
