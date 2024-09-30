// application/src/middleware/authMiddleware.js

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session.user && req.session.user.id) {
      return next();
    }
    res.redirect("/login"); // Redirect to login if not authenticated
  },
};
