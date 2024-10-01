const TutorsModel = require("../models/tutorsModel");
const SubjectsModel = require("../models/subjectsModel");

/**
 * Controller method to list tutors with optional filters and sorting.
 */
const listTutors = async (req, res) => {
  try {
    const filters = {
      subject: req.query.subject ? req.query.subject.trim() : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
    };

    const sortOptions = ["newest", "price_asc", "price_desc"];
    const sort = sortOptions.includes(req.query.sort)
      ? req.query.sort
      : "newest";

    const tutors = await TutorsModel.getAll(filters, sort);
    const subjects = await SubjectsModel.getAllSubjects();

    res.render("tutors", {
      tutors,
      filters,
      sort,
      subjects,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).render("error", {
      message: "Internal Server Error",
      user: req.session.user,
    });
  }
};

const getTutorProfile = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const tutor = await TutorsModel.getTutorById(tutorId);
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }
    res.render("tutorProfile", { tutor });
  } catch (error) {
    console.error("Error fetching tutor profile:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  listTutors,
  getTutorProfile,
};
