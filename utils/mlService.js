const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

const mlService = {
  // 1. Home page recommendations
  getHomeRecommendations: async (userId, limit = 8) => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/api/recommend/home`, {
        user_id: userId || null,
        limit: limit
      }, {
        timeout: 5000 // 5 second timeout
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching home recommendations:', error.message);
      return [];
    }
  },

  // 2. Product detail - Similar products
  getSimilarProducts: async (productId, limit = 5) => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/api/product/similar`, {
        product_id: productId,
        limit: limit
      }, {
        timeout: 5000
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching similar products:', error.message);
      return [];
    }
  },

  // 2. Product detail - Customers also bought
  getAlsoBought: async (productId, limit = 5) => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/api/product/also-bought`, {
        product_id: productId,
        limit: limit
      }, {
        timeout: 5000
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching also bought:', error.message);
      return [];
    }
  },

  // 3. Cart - Complementary items
  getComplementaryItems: async (cartProductIds, limit = 5) => {
    try {
      if (!cartProductIds || cartProductIds.length === 0) {
        return [];
      }
      const response = await axios.post(`${ML_SERVICE_URL}/api/cart/complementary`, {
        product_ids: cartProductIds,
        limit: limit
      }, {
        timeout: 5000
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching complementary items:', error.message);
      return [];
    }
  },

  // 3. Cart - Best deals
  getBestDeals: async (cartProductIds, limit = 3) => {
    try {
      if (!cartProductIds || cartProductIds.length === 0) {
        return [];
      }
      const response = await axios.post(`${ML_SERVICE_URL}/api/cart/best-deals`, {
        product_ids: cartProductIds,
        limit: limit
      }, {
        timeout: 5000
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching best deals:', error.message);
      return [];
    }
  },

  // 4. Shop ranking
  getRankedShops: async (userId = null) => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/api/shops/ranked`, {
        user_id: userId
      }, {
        timeout: 5000
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching ranked shops:', error.message);
      return [];
    }
  },

  // 5. Search
  searchProducts: async (query, userId = null, limit = 20) => {
    try {
      if (!query || query.trim() === '') {
        return [];
      }
      const response = await axios.post(`${ML_SERVICE_URL}/api/search`, {
        query: query.trim(),
        user_id: userId,
        limit: limit
      }, {
        timeout: 5000
      });
      return response.data || [];
    } catch (error) {
      console.error('Error searching products:', error.message);
      return [];
    }
  }
};

module.exports = mlService;



