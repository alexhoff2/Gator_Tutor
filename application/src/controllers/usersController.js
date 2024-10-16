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

    // Update user's is_tutor status
    await db.query("UPDATE users SET is_tutor = 1 WHERE id = ?", [userId]);

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

exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const pool = await getPool();

    // Fetch user data
    const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    const user = userRows[0];

    if (!user) {
      return res.status(404).send("User not found");
    }

    let tutorPost = null;
    if (user.role === "tutor") {
      // Fetch tutor post data
      const [tutorPostRows] = await pool.query(
        "SELECT * FROM tutor_posts WHERE user_id = ?",
        [userId]
      );
      tutorPost = tutorPostRows[0];

      // Parse availability if it exists
      if (tutorPost && tutorPost.availability) {
        try {
          if (typeof tutorPost.availability === "string") {
            tutorPost.availability = JSON.parse(tutorPost.availability);
          }
        } catch (error) {
          console.error("Error parsing availability:", error);
          tutorPost.availability = [];
        }
      }

      // Fetch subjects for the tutor
      if (tutorPost) {
        const [subjectsRows] = await pool.query(
          `SELECT s.subject_name 
           FROM tutor_subjects ts 
           JOIN subjects s ON ts.subject_id = s.id 
           WHERE ts.tutor_id = ?`,
          [tutorPost.id]
        );
        tutorPost.subjects = subjectsRows
          .map((row) => row.subject_name)
          .join(", ");
      }
    }

    // Fetch messages
    const [messages] = await pool.query(
      `SELECT m.*, 
        CASE 
          WHEN m.sender_id = ? THEN r.username 
          ELSE s.username 
        END AS other_user_name,
        CASE 
          WHEN m.sender_id = ? THEN r.id 
          ELSE s.id 
        END AS other_user_id
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.recipient_id = r.id
      WHERE m.sender_id = ? OR m.recipient_id = ?
      ORDER BY m.created_at ASC`,
      [userId, userId, userId, userId]
    );

    const conversations = messages.reduce((acc, message) => {
      const otherUserId = message.other_user_id;
      if (!acc[otherUserId]) {
        acc[otherUserId] = { name: message.other_user_name, messages: [] };
      }
      acc[otherUserId].messages.push(message);
      return acc;
    }, {});

    res.render("profile", {
      user: user,
      tutorPost: tutorPost,
      conversations: conversations,
      currentUserId: userId,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).send("Server error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).send("New passwords do not match");
    }

    const pool = await getPool();
    const [userDetails] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );
    const user = userDetails[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedNewPassword,
      userId,
    ]);

    res.redirect("/profile");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Error changing password");
  }
};

exports.getEditTutorProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const pool = await getPool();

    const [tutorPost] = await pool.query(
      "SELECT * FROM tutor_posts WHERE user_id = ?",
      [userId]
    );
    const [subjects] = await pool.query("SELECT * FROM subjects");

    res.render("edit-tutor-profile", { tutorPost: tutorPost[0], subjects });
  } catch (error) {
    console.error("Error fetching tutor profile data:", error);
    res.status(500).send("Error fetching tutor profile data");
  }
};

exports.postEditTutorProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const {
      bio,
      hourlyRate,
      experience,
      contact_info,
      subjects,
      day,
      startTime,
      endTime,
      availabilityLocation,
    } = req.body;

    const profilePhoto = req.files["profilePhoto"]
      ? `/uploads/${req.files["profilePhoto"][0].filename}`
      : null;
    const profileVideo = req.files["profileVideo"]
      ? `/uploads/${req.files["profileVideo"][0].filename}`
      : null;

    const availability = day.map((d, index) => ({
      day: d,
      start_time: startTime[index],
      end_time: endTime[index],
      location: availabilityLocation[index],
    }));

    const pool = await getPool();
    await pool.query(
      "UPDATE tutor_posts SET bio = ?, hourly_rate = ?, experience = ?, contact_info = ?, availability = ?, profile_photo = ?, profile_video = ? WHERE user_id = ?",
      [
        bio,
        hourlyRate,
        experience,
        contact_info,
        JSON.stringify(availability),
        profilePhoto,
        profileVideo,
        userId,
      ]
    );

    // Update subjects
    await pool.query("DELETE FROM tutor_subjects WHERE tutor_id = ?", [userId]);
    const subjectInserts = subjects.map((subjectId) =>
      pool.query(
        "INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (?, ?)",
        [userId, subjectId]
      )
    );
    await Promise.all(subjectInserts);

    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    res.status(500).send("Error updating tutor profile");
  }
};
