const Subjects = require("../models/subjectsModel");

// Middleware to fetch all subjects and attach to response locals
exports.fetchAllSubjects = async (req, res, next) => {
  try {
    console.log("Fetching all subjects...");
    const subjects = await Subjects.getAllSubjects();
    res.locals.subjects = subjects; // Make 'subjects' available globally in all views
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error fetching subjects:", error);
    next(error); // Pass the error to the next middleware if any
  }
};
