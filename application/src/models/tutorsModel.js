const { getPool } = require("../config/db");

const TutorsModel = {
  create: async (userData) => {
    const pool = await getPool(); // Ensure the pool is ready
    const { username, email, password, role, is_tutor } = userData;
    const query = `
      INSERT INTO users (username, email, password, role, is_tutor) 
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await pool.query(query, [
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
    const pool = await getPool(); // Ensure the pool is ready
    const query = `
      SELECT * FROM users WHERE username = ? OR email = ?
    `;
    try {
      const [rows] = await pool.query(query, [username, email]);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  createTutorPost: async (tutorPostData, subjects) => {
    const pool = await getPool(); // Ensure the pool is ready
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
      const [result] = await pool.query(query, [
        user_id,
        bio,
        availability, // Store as JSON
        hourly_rate,
        experience,
        contact_info, // Stored in the database
        profile_photo,
        profile_video,
      ]);
      const tutorPostId = result.insertId;

      // Insert subjects into tutor_subjects table using tutorPostId instead of user_id
      const tutorSubjectsPromises = subjects.map((subjectId) =>
        pool.query(
          "INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (?, ?)",
          [tutorPostId, subjectId] // Changed from user_id to tutorPostId
        )
      );
      await Promise.all(tutorSubjectsPromises);
    } catch (err) {
      throw err;
    }
  },

  getAll: async (filters = {}, sort = "newest") => {
    const pool = await getPool();
    let query = `
      SELECT u.id, u.username, tp.hourly_rate, tp.profile_photo, tp.bio,
             GROUP_CONCAT(DISTINCT s.subject_name) AS subjects
      FROM users u
      JOIN tutor_posts tp ON u.id = tp.user_id
      LEFT JOIN tutor_subjects ts ON tp.id = ts.tutor_id
      LEFT JOIN subjects s ON ts.subject_id = s.id
      WHERE u.is_tutor = 1
    `;

    const queryParams = [];

    if (filters.query) {
      query += ` AND (u.username LIKE ? OR tp.bio LIKE ? OR s.subject_name LIKE ?)`;
      const likeQuery = `%${filters.query}%`;
      queryParams.push(likeQuery, likeQuery, likeQuery);
    }

    if (filters.subjects && filters.subjects.length > 0) {
      query += ` AND s.subject_name IN (?)`;
      queryParams.push(filters.subjects);
    }

    if (filters.minPrice) {
      query += ` AND tp.hourly_rate >= ?`;
      queryParams.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ` AND tp.hourly_rate <= ?`;
      queryParams.push(filters.maxPrice);
    }

    query += ` GROUP BY u.id`;

    switch (sort) {
      case "oldest":
        query += ` ORDER BY tp.created_at ASC`;
        break;
      case "price-asc":
        query += ` ORDER BY tp.hourly_rate ASC`;
        break;
      case "price-desc":
        query += ` ORDER BY tp.hourly_rate DESC`;
        break;
      case "newest":
      default:
        query += ` ORDER BY tp.created_at DESC`;
    }

    try {
      const [rows] = await pool.query(query, queryParams);
      return rows;
    } catch (err) {
      console.error("Error in TutorsModel.getAll:", err);
      throw err;
    }
  },

  getTutorById: async (tutorId) => {
    const pool = await getPool();
    const query = `
      SELECT u.id, u.username, u.email, tp.bio, tp.hourly_rate, tp.availability, tp.experience, tp.profile_photo, tp.profile_video,
             GROUP_CONCAT(DISTINCT s.subject_name) AS subjects
      FROM users u
      JOIN tutor_posts tp ON u.id = tp.user_id
      LEFT JOIN tutor_subjects ts ON tp.id = ts.tutor_id
      LEFT JOIN subjects s ON ts.subject_id = s.id
      WHERE u.id = ? AND u.is_tutor = 1
      GROUP BY u.id
    `;
    try {
      const [rows] = await pool.query(query, [tutorId]);
      return rows[0] || null;
    } catch (err) {
      console.error("Error in TutorsModel.getTutorById:", err);
      throw err;
    }
  },
};

module.exports = TutorsModel;
