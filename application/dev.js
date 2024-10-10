const browserSync = require("browser-sync").create();
const nodemon = require("nodemon");

let browserSyncInitialized = false;

// Start Nodemon to watch server-side files
nodemon({
  script: "src/index.js",
  watch: ["src/"],
  ext: "js,ejs,css,json",
  ignore: ["node_modules"],
  env: { PORT: process.env.PORT || 3001 },
});

// When Nodemon starts the server
nodemon.on("start", () => {
  console.log("Nodemon started");

  if (!browserSyncInitialized) {
    browserSyncInitialized = true;
    // Initialize BrowserSync after a slight delay to ensure the server is up
    setTimeout(() => {
      browserSync.init(
        {
          proxy: `http://localhost:${process.env.PORT || 3001}`,
          port: process.env.BROWSER_SYNC_PORT || 3002,
          ui: false,
          files: [
            "src/**/*.js",
            "src/**/*.ejs",
            "public/**/*.css",
            "public/**/*.js",
          ],
          open: false,
          host: "0.0.0.0",
          watchOptions: {
            usePolling: true,
            interval: 500,
          },
        },
        (err, bs) => {
          if (err) {
            console.error("BrowserSync initialization error:", err);
          } else {
            console.log("BrowserSync initialized");
          }
        }
      );
    }, 1000);
  }
});

// When Nodemon restarts the server
nodemon.on("restart", () => {
  console.log("Nodemon restarted");

  // Reload BrowserSync to refresh the browser
  setTimeout(() => {
    browserSync.reload();
  }, 1000); // Adjust the delay as needed
});

// Handle Nodemon exit
nodemon.on("quit", () => {
  console.log("Nodemon quit");
  process.exit();
});

// Handle Nodemon errors
nodemon.on("error", (err) => {
  console.error("Nodemon error:", err);
});

// Remove this section as it's redundant with Nodemon
// const app = require("./src/app");
// const port = process.env.PORT || 3001;
//
// app.listen(port, "0.0.0.0", () => {
//   console.log(`Server running on http://0.0.0.0:${port}`);
// });
