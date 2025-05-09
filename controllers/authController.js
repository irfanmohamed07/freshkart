const User = require('../models/user');

/**
 * Authentication controller
 */
const authController = {
  /**
   * Render the login page
   */
  getLoginPage: (req, res) => {
    res.render('login', { title: 'Login' });
  },

  /**
   * Handle login form submission
   */
  login: async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Authenticate user
      const user = await User.authenticate(email, password);
      
      if (!user) {
        return res.render('login', { 
          title: 'Login',
          error: 'Invalid email or password',
          email
        });
      }
      
      // Store user information in session
      req.session.userId = user.id;
      req.session.name = user.name;
      req.session.email = user.email;
      req.session.isAdmin = user.is_admin || false;
      
      // Redirect to the originally requested URL or home page
      const redirectUrl = req.session.returnTo || '/';
      delete req.session.returnTo;
      
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('Login error:', error);
      res.render('login', { 
        title: 'Login',
        error: 'An error occurred. Please try again.',
        email
      });
    }
  },

  /**
   * Render the signup page
   */
  getSignupPage: (req, res) => {
    res.render('signup', { title: 'Sign Up' });
  },

  /**
   * Handle signup form submission
   */
  signup: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.render('signup', {
        title: 'Sign Up',
        error: 'All fields are required',
        name,
        email
      });
    }
    
    if (password !== confirmPassword) {
      return res.render('signup', {
        title: 'Sign Up',
        error: 'Passwords do not match',
        name,
        email
      });
    }
    
    try {
      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      
      if (existingUser) {
        return res.render('signup', {
          title: 'Sign Up',
          error: 'Email already in use',
          name,
          email
        });
      }
      
      // Create new user
      const newUser = await User.create({
        name,
        email,
        password
      });
      
      // Log the user in
      req.session.userId = newUser.id;
      req.session.email = email;
      req.session.name = name;
      
      res.redirect('/');
      
    } catch (error) {
      console.error('Signup error:', error);
      res.render('signup', {
        title: 'Sign Up',
        error: 'An error occurred. Please try again.',
        name,
        email
      });
    }
  },

  /**
   * Handle logout
   */
  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
  }
};

module.exports = authController; 