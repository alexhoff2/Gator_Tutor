// models/userModel.js

const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const { username, email, password, role, is_tutor } = userData;
    const query = `INSERT INTO users (username, email, password, role, is_tutor) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [username, email, password, role, is_tutor], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, result) => {
      if (err) return callback(err);
      callback(null, result[0]);
    });
  },

  // Add more user methods as needed, like `findById`, `update`, `delete`, etc.
};

module.exports = User;
