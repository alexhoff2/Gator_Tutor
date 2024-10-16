const { getPool } = require("../config/db");

const SubjectsModel = {
  getAllSubjects: async () => {
    try {
      const pool = await getPool();
      const [rows] = await pool.query("SELECT * FROM subjects");
      return rows;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error;
    }
  },
};

module.exports = SubjectsModel;
