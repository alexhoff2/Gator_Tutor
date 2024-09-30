const db = require("../config/db");

/**
 * Retrieves all subjects from the database.
 * @returns {Promise<Array>} An array of subject objects.
 */
const getAllSubjects = async () => {
  try {
    const [rows] = await db.execute("SELECT id, subject_name FROM subjects");
    return rows;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

module.exports = {
  getAllSubjects,
};
