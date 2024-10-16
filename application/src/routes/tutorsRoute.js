const express = require("express");
const router = express.Router();
const tutorsController = require("../controllers/tutorsController");

// GET /tutors
router.get("/", tutorsController.listTutors);

router.get("/:id", tutorsController.getTutorProfile);

module.exports = router;
