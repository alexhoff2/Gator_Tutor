console.log("Loading usersRoute.js");

const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const subjectsModel = require("../models/subjectsModel");
const messagesController = require("../controllers/messagesController");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Initialize Multer with storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: function (req, file, cb) {
    // Accept images and videos only
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following filetypes - " +
            filetypes
        )
      );
    }
  },
});

// Route to handle form submission from become-a-tutor.ejs
router.post(
  "/become-a-tutor",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "profileVideo", maxCount: 1 },
  ]),
  usersController.becomeTutor
);

// Route for the "become a tutor" page
router.get(
  "/become-a-tutor",
  ensureAuthenticated,
  usersController.checkTutorPost,
  async (req, res) => {
    try {
      const subjects = await subjectsModel.getAllSubjects();
      res.render("become-a-tutor", { subjects });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Messages routes
router.post(
  "/messages/send",
  ensureAuthenticated,
  messagesController.sendMessage
);
router.get("/messages", ensureAuthenticated, messagesController.getMessages);

module.exports = router;
