// models/usersModel.js

const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const { username, email, password, role, is_tutor, expertise, hourly_rate, subjects } = userData;
    const query = `
      INSERT INTO users (username, email, password, role, is_tutor, expertise, hourly_rate, subjects) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [username, email, password, role, is_tutor, expertise, hourly_rate, subjects], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
};

module.exports = User;
