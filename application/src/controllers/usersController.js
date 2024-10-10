// application/src/controllers/usersController.js

const User = require("../models/usersModel"); // Ensure correct path
const { getPool } = require("../config/db"); // Add this line to query the database for subject IDs

exports.becomeTutor = async (req, res) => {
  try {
    const {
      bio, // Extract bio from the form
      hourlyRate,
      experience,
      contact_info,
      day,
      startTime,
      endTime,
      availabilityLocation, // Keep this to construct the JSON object
      subjects, // Extract subjects from the form
    } = req.body;

    // Handle file uploads
    const profilePhoto = req.files["profilePhoto"]
      ? `/uploads/${req.files["profilePhoto"][0].filename}`
      : null;
    const profileVideo = req.files["profileVideo"]
      ? `/uploads/${req.files["profileVideo"][0].filename}`
      : null;

    // Check if user is logged in
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).send("Unauthorized: Please log in.");
    }

    const userId = req.session.user.id;

    // Check if the user already has a tutor post
    const [existingTutorPost] = await db.query(
      "SELECT * FROM tutor_posts WHERE user_id = ?",
      [userId]
    );
    if (existingTutorPost.length > 0) {
      return res.status(400).send("You already have a tutor post.");
    }

    // Format availability as JSON
    const availability = day.map((d, index) => ({
      day: d,
      start_time: startTime[index],
      end_time: endTime[index],
      location: availabilityLocation[index],
    }));

    // Insert tutor post using the User model
    const tutorPostData = {
      user_id: userId,
      bio, // Use bio directly
      availability: JSON.stringify(availability), // Store as JSON
      hourly_rate: hourlyRate,
      experience,
      contact_info, // Included in the data to be stored
      profile_photo: profilePhoto,
      profile_video: profileVideo,
    };

    // Parse subjects field as JSON array
    console.log("Subjects received from form:", subjects); // Debugging log
    let subjectNames = [];

    if (typeof subjects === "string") {
      try {
        const subjectsArray = JSON.parse(subjects);
        // subjectsArray is [ {value: "All University"}, {value: "Business"}, ... ]
        subjectNames = subjectsArray.map((s) => s.value.trim());
      } catch (e) {
        console.error("Failed to parse subjects JSON:", subjects);
        return res.status(400).send("Invalid subjects format.");
      }
    } else {
      console.error("Unknown subjects format:", subjects);
      return res.status(400).send("Invalid subjects format.");
    }

    console.log("Extracted Subject Names:", subjectNames); // Debugging log

    const subjectIds = [];

    for (const subjectName of subjectNames) {
      console.log("Processing subject:", subjectName); // Debugging log
      const [subjectResult] = await db.query(
        "SELECT id FROM subjects WHERE subject_name = ?",
        [subjectName]
      );
      if (subjectResult.length > 0) {
        subjectIds.push(subjectResult[0].id);
      } else {
        console.error(`Subject not found: ${subjectName}`);
      }
    }

    console.log("Subject IDs:", subjectIds); // Debugging log

    if (subjectIds.length === 0) {
      return res.status(400).send("No valid subjects selected.");
    }

    await User.createTutorPost(tutorPostData, subjectIds);

    res.redirect("/"); // Redirect to home or appropriate page after successful submission
  } catch (error) {
    console.error("Error in becomeTutor:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// New method to check if user has a tutor post
exports.checkTutorPost = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).send("Unauthorized: Please log in.");
    }

    const userId = req.session.user.id;
    const pool = await getPool(); // Get the pool
    const [existingTutorPost] = await pool.query(
      "SELECT * FROM tutor_posts WHERE user_id = ?",
      [userId]
    );

    if (existingTutorPost.length > 0) {
      return res.redirect("/profile"); // Redirect to profile page if tutor post exists
    }

    next(); // Proceed to the "Become a Tutor" page if no tutor post exists
  } catch (error) {
    console.error("Error in checkTutorPost:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
