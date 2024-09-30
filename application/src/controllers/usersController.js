// application/src/controllers/usersController.js

const User = require("../models/usersModel"); // Ensure correct path

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
    } = req.body;

    // Handle file uploads
    const profilePhoto = req.files["profilePhoto"]
      ? req.files["profilePhoto"][0].path
      : null;
    const profileVideo = req.files["profileVideo"]
      ? req.files["profileVideo"][0].path
      : null;

    // Check if user is logged in
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).send("Unauthorized: Please log in.");
    }

    const userId = req.session.user.id;

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

    await User.createTutorPost(tutorPostData);

    res.redirect("/"); // Redirect to home or appropriate page after successful submission
  } catch (error) {
    console.error("Error in becomeTutor:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
