const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a new pool with connection details from environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'grocery_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'irfan2004',
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Export the pool for use in other modules
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 