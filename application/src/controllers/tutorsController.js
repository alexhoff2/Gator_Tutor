const TutorsModel = require("../models/tutorsModel");
const { getPool } = require("../config/db");

/**
 * Controller method to list tutors with optional filters and sorting.
 */
const listTutors = async (req, res) => {
  try {
    const filters = {
      query: req.query.query || null,
      subjects: req.query.subjects ? req.query.subjects.split(",") : [],
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
    };

    const sort = req.query.sort || "newest";

    const tutors = await TutorsModel.getAll(filters, sort);

    const pool = await getPool();
    const [subjectsWithCounts] = await pool.query(`
      SELECT subjects.subject_name, COUNT(tutor_subjects.tutor_id) AS tutor_count
      FROM subjects
      JOIN tutor_subjects ON subjects.id = tutor_subjects.subject_id
      GROUP BY subjects.id
      HAVING tutor_count > 0
    `);

    res.render("tutors", {
      tutors,
      subjects: subjectsWithCounts,
      filters,
      sort,
    });
  } catch (error) {
    console.error("Error in listTutors:", error);
    res.status(500).send("Server Error");
  }
};

const getTutorProfile = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const tutor = await TutorsModel.getTutorById(tutorId);
    if (!tutor) {
      return res.status(404).render("404", { message: "Tutor not found" });
    }
    res.render("tutorProfile", { tutor });
  } catch (error) {
    console.error("Error fetching tutor profile:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};

module.exports = {
  listTutors,
  getTutorProfile,
};
