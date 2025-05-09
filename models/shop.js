const db = require('./db');

/**
 * Shop model functions
 */
const Shop = {
  /**
   * Find all shops
   * @param {number} limit - Optional limit
   * @param {number} offset - Optional offset for pagination
   * @returns {Promise<Array>} - Array of shop objects
   */
  findAll: async (limit = 10, offset = 0) => {
    try {
      const result = await db.query(
        'SELECT * FROM shops ORDER BY name LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Shop.findAll:', error);
      throw error;
    }
  },

  /**
   * Find a shop by ID
   * @param {number} id - Shop ID
   * @returns {Promise<Object>} - Shop object
   */
  findById: async (id) => {
    try {
      const result = await db.query(
        'SELECT * FROM shops WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Shop.findById:', error);
      throw error;
    }
  },

  /**
   * Get total number of shops
   * @returns {Promise<number>} - Count of shops
   */
  getCount: async () => {
    try {
      const result = await db.query('SELECT COUNT(*) FROM shops');
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error in Shop.getCount:', error);
      throw error;
    }
  },

  /**
   * Create a new shop
   * @param {Object} shopData - Shop data
   * @param {string} shopData.name - Shop name
   * @param {string} shopData.address - Shop address
   * @param {string} shopData.contact - Shop contact info
   * @param {string} shopData.logo - Shop logo URL
   * @returns {Promise<Object>} - Created shop
   */
  create: async ({ name, address, contact, logo }) => {
    try {
      const result = await db.query(
        'INSERT INTO shops (name, address, contact, logo, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [name, address, contact, logo]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Shop.create:', error);
      throw error;
    }
  },

  /**
   * Update a shop
   * @param {number} id - Shop ID
   * @param {Object} shopData - Shop data to update
   * @returns {Promise<Object>} - Updated shop
   */
  update: async (id, shopData) => {
    try {
      const { name, address, contact, logo } = shopData;
      const result = await db.query(
        'UPDATE shops SET name = $1, address = $2, contact = $3, logo = $4 WHERE id = $5 RETURNING *',
        [name, address, contact, logo, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Shop.update:', error);
      throw error;
    }
  },

  /**
   * Delete a shop
   * @param {number} id - Shop ID
   * @returns {Promise<boolean>} - Success status
   */
  delete: async (id) => {
    try {
      const result = await db.query(
        'DELETE FROM shops WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error in Shop.delete:', error);
      throw error;
    }
  }
};

module.exports = Shop; 