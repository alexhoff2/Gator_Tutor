const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

const connectWithRetry = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      console.log("Attempting to connect to database...");
      console.log(`DB_HOST: ${process.env.DB_HOST}`);
      console.log(`DB_USER: ${process.env.DB_USER}`);
      console.log(`DB_NAME: ${process.env.DB_NAME}`);

      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      const conn = await pool.getConnection();
      console.log("Database connected successfully");

      // Log database and table information
      const [rows] = await conn.query("SHOW TABLES");
      console.log(
        "Tables in the database:",
        rows.map((row) => Object.values(row)[0])
      );

      conn.release();

      return pool;
    } catch (err) {
      console.error(`Error connecting to the database: ${err.message}`);
      retries -= 1;

      if (retries === 0) {
        console.error("Max retries reached, exiting...");
        process.exit(1);
      }

      console.log(
        `Retrying to connect to the database in ${delay / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const getPool = async () => {
  if (!pool) {
    pool = await connectWithRetry();
  }
  return pool;
};

module.exports = { getPool };
