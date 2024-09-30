const db = require("../config/db");

const User = {
  create: async (userData) => {
    const { username, email, password, role, is_tutor } = userData;
    const query = `
      INSERT INTO users (username, email, password, role, is_tutor) 
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await db.query(query, [
        username,
        email,
        password,
        role,
        is_tutor,
      ]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  findByUsernameOrEmail: async (username, email) => {
    const query = `
      SELECT * FROM users WHERE username = ? OR email = ?
    `;
    try {
      const [rows] = await db.query(query, [username, email]);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  createTutorPost: async (tutorPostData) => {
    const {
      user_id,
      bio,
      availability, // JSON formatted availability
      hourly_rate,
      experience,
      contact_info, // Included in the database query
      profile_photo,
      profile_video,
    } = tutorPostData;
    const query = `
      INSERT INTO tutor_posts (
        user_id, 
        bio, 
        availability, 
        hourly_rate, 
        experience, 
        contact_info, 
        profile_photo, 
        profile_video
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await db.query(query, [
        user_id,
        bio,
        availability, // Store as JSON
        hourly_rate,
        experience,
        contact_info, // Stored in the database
        profile_photo,
        profile_video,
      ]);
    } catch (err) {
      throw err;
    }
  },
};

module.exports = User;
