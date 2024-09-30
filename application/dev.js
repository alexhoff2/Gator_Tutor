const browserSync = require('browser-sync').create();
const nodemon = require('nodemon');

let browserSyncInitialized = false;

// Start Nodemon to watch server-side files
nodemon({
    script: 'src/index.js', // Ensure this path is correct relative to dev.js
    watch: ['src/'],
    ext: 'js,ejs,css,json',
    ignore: ['node_modules']
});

// When Nodemon starts the server
nodemon.on('start', () => {
    console.log('Nodemon started');

    if (!browserSyncInitialized) {
        browserSyncInitialized = true;
        // Initialize BrowserSync after a slight delay to ensure the server is up
        setTimeout(() => {
            browserSync.init({
                proxy: 'http://localhost:3000', // Your server's address
                port: 3001, // BrowserSync's port
                open: false, // Prevents BrowserSync from automatically opening a browser
                files: [
                    'views/**/*.ejs', // Watch EJS templates
                    'public/**/*.*'    // Watch static files (CSS, JS, images, etc.)
                ],
                notify: false, // Disable BrowserSync notifications in the browser
                reloadDelay: 500 // Wait before reloading to ensure server is ready
            }, (err, bs) => {
                if (err) {
                    console.error('BrowserSync initialization error:', err);
                } else {
                    console.log('BrowserSync initialized');
                }
            });
        }, 1000);
    }
});

// When Nodemon restarts the server
nodemon.on('restart', () => {
    console.log('Nodemon restarted');

    // Reload BrowserSync to refresh the browser
    setTimeout(() => {
        browserSync.reload();
    }, 1000); // Adjust the delay as needed
});

// Handle Nodemon exit
nodemon.on('quit', () => {
    console.log('Nodemon quit');
    process.exit();
});

// Handle Nodemon errors
nodemon.on('error', (err) => {
    console.error('Nodemon error:', err);
});