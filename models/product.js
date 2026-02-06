const db = require('./db');

/**
 * Product model functions
 */
const Product = {
  /**
   * Find all products
   * @param {number} limit - Optional limit
   * @param {number} offset - Optional offset for pagination
   * @returns {Promise<Array>} - Array of product objects
   */
  findAll: async (limit = 20, offset = 0) => {
    try {
      const result = await db.query(
        'SELECT p.*, s.name as shop_name FROM products p JOIN shops s ON p.shop_id = s.id ORDER BY p.created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Product.findAll:', error);
      throw error;
    }
  },

  /**
   * Find a product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} - Product object
   */
  findById: async (id) => {
    try {
      const result = await db.query(
        'SELECT p.*, s.name as shop_name FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Product.findById:', error);
      throw error;
    }
  },

  /**
   * Find products by shop ID
   * @param {number} shopId - Shop ID
   * @param {number} limit - Optional limit
   * @param {number} offset - Optional offset for pagination
   * @returns {Promise<Array>} - Array of product objects
   */
  findByShopId: async (shopId, limit = 20, offset = 0, filters = {}) => {
    try {
      let query = 'SELECT * FROM products WHERE shop_id = $1';
      const params = [shopId];
      let paramIndex = 2;

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query += ` AND (category = $${paramIndex} OR name ILIKE $${paramIndex + 1} OR description ILIKE $${paramIndex + 2})`;
        const categoryLower = filters.category.toLowerCase();
        params.push(categoryLower, `%${categoryLower}%`, `%${categoryLower}%`);
        paramIndex += 3;
      }

      // Apply search filter
      if (filters.search) {
        query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
        params.push(`%${filters.search}%`, `%${filters.search}%`);
        paramIndex += 2;
      }

      // Apply price filter
      if (filters.minPrice) {
        query += ` AND price >= $${paramIndex}`;
        params.push(filters.minPrice);
        paramIndex++;
      }
      if (filters.maxPrice) {
        query += ` AND price <= $${paramIndex}`;
        params.push(filters.maxPrice);
        paramIndex++;
      }

      // Apply sorting
      let orderBy = 'name';
      if (filters.sort === 'price_low') {
        orderBy = 'price ASC';
      } else if (filters.sort === 'price_high') {
        orderBy = 'price DESC';
      } else if (filters.sort === 'name') {
        orderBy = 'name ASC';
      }

      query += ` ORDER BY ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error in Product.findByShopId:', error);
      throw error;
    }
  },

  /**
   * Find products with the same name across different shops
   * @param {string} productName - Product name
   * @returns {Promise<Array>} - Array of similar products from different shops
   */
  findSimilarProducts: async (productName) => {
    try {
      // Use ILIKE for case-insensitive search
      const result = await db.query(
        'SELECT p.*, s.name as shop_name FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.name ILIKE $1 ORDER BY p.price',
        [`%${productName}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Product.findSimilarProducts:', error);
      throw error;
    }
  },

  /**
   * Get total number of products
   * @returns {Promise<number>} - Count of products
   */
  getCount: async () => {
    try {
      const result = await db.query('SELECT COUNT(*) FROM products');
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error in Product.getCount:', error);
      throw error;
    }
  },

  /**
   * Get count of products by shop ID
   * @param {number} shopId - Shop ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<number>} - Count of products
   */
  getCountByShopId: async (shopId, filters = {}) => {
    try {
      let query = 'SELECT COUNT(*) FROM products WHERE shop_id = $1';
      const params = [shopId];
      let paramIndex = 2;

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query += ` AND (category = $${paramIndex} OR name ILIKE $${paramIndex + 1} OR description ILIKE $${paramIndex + 2})`;
        const categoryLower = filters.category.toLowerCase();
        params.push(categoryLower, `%${categoryLower}%`, `%${categoryLower}%`);
        paramIndex += 3;
      }

      // Apply search filter
      if (filters.search) {
        query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
        params.push(`%${filters.search}%`, `%${filters.search}%`);
        paramIndex += 2;
      }

      // Apply price filter
      if (filters.minPrice) {
        query += ` AND price >= $${paramIndex}`;
        params.push(filters.minPrice);
        paramIndex++;
      }
      if (filters.maxPrice) {
        query += ` AND price <= $${paramIndex}`;
        params.push(filters.maxPrice);
        paramIndex++;
      }

      const result = await db.query(query, params);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error in Product.getCountByShopId:', error);
      throw error;
    }
  },

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {string} productData.name - Product name
   * @param {string} productData.description - Product description
   * @param {number} productData.price - Product price
   * @param {number} productData.shop_id - Shop ID
   * @param {string} productData.image_url - Product image URL
   * @returns {Promise<Object>} - Created product
   */
  create: async ({ name, description, price, shop_id, image_url }) => {
    try {
      const result = await db.query(
        'INSERT INTO products (name, description, price, shop_id, image_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
        [name, description, price, shop_id, image_url]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Product.create:', error);
      throw error;
    }
  },

  /**
   * Update a product
   * @param {number} id - Product ID
   * @param {Object} productData - Product data to update
   * @returns {Promise<Object>} - Updated product
   */
  update: async (id, productData) => {
    try {
      const { name, description, price, image_url } = productData;
      const result = await db.query(
        'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *',
        [name, description, price, image_url, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Product.update:', error);
      throw error;
    }
  },

  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} - Success status
   */
  delete: async (id) => {
    try {
      const result = await db.query(
        'DELETE FROM products WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error in Product.delete:', error);
      throw error;
    }
  }
};

module.exports = Product; 