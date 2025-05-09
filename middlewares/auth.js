/**
 * Middleware to check if the user is authenticated
 * Redirects to login page if not authenticated
 */
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Store the original URL they were trying to access
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/**
 * Middleware to check if the user is an admin
 * Redirects to home page if not an admin
 */
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.isAdmin) {
    return next();
  }
  
  // Redirect to home page if not admin
  res.redirect('/');
};

module.exports = {
  requireAuth,
  requireAdmin
}; 