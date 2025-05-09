const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'grocery_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully at', res.rows[0].now);
  }
});

// Database utility functions
const db = {
  /**
   * Execute a query with parameters
   * @param {string} text - SQL query text
   * @param {Array} params - Query parameters
   * @returns {Promise} - Query result
   */
  query: (text, params) => pool.query(text, params),

  /**
   * Get a client from the pool
   * @returns {Promise} - Client from the pool
   */
  getClient: async () => {
    const client = await pool.connect();
    return client;
  },

  /**
   * Execute a transaction with callback
   * @param {Function} callback - Function to execute within transaction
   * @returns {Promise} - Result of the transaction
   */
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

module.exports = db; 