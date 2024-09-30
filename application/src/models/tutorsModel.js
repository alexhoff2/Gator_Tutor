const db = require("../config/db");

const TutorsModel = {
  getAll: async (filters, sort) => {
    let query = `
      SELECT tutor_posts.*, users.username, users.email, users.role
      FROM tutor_posts
      JOIN users ON tutor_posts.user_id = users.id
      WHERE 1=1
    `;

    const queryParams = [];

    if (filters.subject) {
      query += `
        AND tutor_posts.id IN (
          SELECT tutor_post_id
          FROM tutor_subjects
          WHERE subject_id = (
            SELECT id FROM subjects WHERE subject_name = ?
          )
        )
      `;
      queryParams.push(filters.subject);
    }
    if (filters.minRating) {
      query += ` AND tutor_posts.reviews >= ?`;
      queryParams.push(filters.minRating);
    }
    if (filters.maxPrice) {
      query += ` AND tutor_posts.hourly_rate <= ?`;
      queryParams.push(filters.maxPrice);
    }

    switch (sort) {
      case "newest":
        query += ` ORDER BY tutor_posts.created_at DESC`;
        break;
      case "rating":
        query += ` ORDER BY tutor_posts.reviews DESC`;
        break;
      case "price_asc":
        query += ` ORDER BY tutor_posts.hourly_rate ASC`;
        break;
      case "price_desc":
        query += ` ORDER BY tutor_posts.hourly_rate DESC`;
        break;
      default:
        query += ` ORDER BY tutor_posts.created_at DESC`;
    }

    try {
      const [rows] = await db.query(query, queryParams);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  getTutorById: async (tutorId) => {
    const query = `
      SELECT tutor_posts.*, users.username, users.email, users.role
      FROM tutor_posts
      JOIN users ON tutor_posts.user_id = users.id
      WHERE tutor_posts.id = ?
    `;
    try {
      const [rows] = await db.query(query, [tutorId]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  },
  // Additional model methods can be added here
};

module.exports = TutorsModel;
