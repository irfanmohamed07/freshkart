const db = require('./db');
const bcrypt = require('bcrypt');

/**
 * User model functions
 */
const User = {
  /**
   * Find a user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} - User object
   */
  findById: async (id) => {
    try {
      const result = await db.query(
        'SELECT id, name, email, is_admin, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  },

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object
   */
  findByEmail: async (email) => {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's plain password
   * @returns {Promise<Object>} - Created user
   */
  create: async ({ name, email, password }) => {
    try {
      // Hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const result = await db.query(
        'INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at',
        [name, email, passwordHash]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error in User.create:', error);
      throw error;
    }
  },

  /**
   * Authenticate a user
   * @param {string} email - User email
   * @param {string} password - User's plain password
   * @returns {Promise<Object|null>} - User object if authenticated, null otherwise
   */
  authenticate: async (email, password) => {
    try {
      const user = await User.findByEmail(email);
      
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return null;
      }

      // Don't return the password hash
      delete user.password_hash;
      return user;
    } catch (error) {
      console.error('Error in User.authenticate:', error);
      throw error;
    }
  }
};

module.exports = User; 