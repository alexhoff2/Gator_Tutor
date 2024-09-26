require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

let isShuttingDown = false;

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the database');

    const port = process.env.PORT || 3000;
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    const gracefulShutdown = (signal) => {
      if (isShuttingDown) {
        return;
      }
      isShuttingDown = true;

      console.log(`${signal} signal received: closing HTTP server`);

      server.close((err) => {
        if (err) {
          console.error('Error closing HTTP server:', err);
          process.exit(1);
        } else {
          console.log('HTTP server closed');
          db.end((dbErr) => {
            if (dbErr) {
              console.error('Error closing database connection:', dbErr);
              process.exit(1);
            } else {
              console.log('Database connection closed');

              // Remove event listeners
              process.removeAllListeners('SIGINT');
              process.removeAllListeners('SIGTERM');

              // Reset stdin if necessary
              if (process.platform === 'win32') {
                if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
                  process.stdin.setRawMode(false);
                }
                process.stdin.pause();
              }

              // Exit the process
              process.exit(0);
            }
          });
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
});
