const db = require('./db');
const Product = require('./product');

/**
 * Cart model
 */
const Cart = {
  /**
   * Get all cart items for a user
   * @param {number} userId - User ID
   * @returns {Array} Cart items
   */
  getCartItems: async (userId) => {
    try {
      // Get cart items from database
      const result = await db.query(
        `SELECT c.id, c.user_id, c.product_id, c.shop_id, c.quantity, 
                p.price, p.name as product_name, s.name as shop_name, p.image_url
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         JOIN shops s ON c.shop_id = s.id
         WHERE c.user_id = $1`,
        [userId]
      );
      
      // Add price comparison data to each item
      const cartItems = await Promise.all(
        result.rows.map(async (item) => {
          // Find similar products from other shops
          const similarProducts = await Product.findSimilarProducts(item.product_name);
          
          // Filter out the current product and organize by shop
          const alternatives = similarProducts
            .filter(p => p.shop_id != item.shop_id)
            .map(alt => ({
              id: alt.id,
              shop_id: alt.shop_id,
              shop_name: alt.shop_name,
              price: alt.price
            }));
          
          // Find cheapest alternative if any
          const cheapestAlternative = alternatives.length > 0 
            ? alternatives.reduce((min, p) => p.price < min.price ? p : min, alternatives[0])
            : null;
          
          // Calculate potential savings
          const potentialSavings = cheapestAlternative && cheapestAlternative.price < item.price
            ? (item.price - cheapestAlternative.price) * item.quantity
            : 0;
          
          return {
            ...item,
            alternatives,
            cheapestAlternative,
            potentialSavings
          };
        })
      );
      
      return cartItems;
    } catch (error) {
      console.error('Error in Cart.getCartItems:', error);
      throw error;
    }
  },
  
  /**
   * Get cart total for a user
   * @param {number} userId - User ID
   * @returns {number} Cart total
   */
  getCartTotal: async (userId) => {
    try {
      const result = await db.query(
        `SELECT SUM(p.price * c.quantity) as total
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1`,
        [userId]
      );
      
      return parseFloat(result.rows[0].total || 0);
    } catch (error) {
      console.error('Error in Cart.getCartTotal:', error);
      throw error;
    }
  },
  
  /**
   * Add item to cart
   * @param {Object} item - Cart item
   * @returns {Object} Added cart item
   */
  addItem: async ({ user_id, product_id, shop_id, quantity }) => {
    try {
      // Check if item already exists in cart
      const existingItem = await db.query(
        `SELECT id FROM cart_items 
         WHERE user_id = $1 AND product_id = $2 AND shop_id = $3`,
        [user_id, product_id, shop_id]
      );
      
      if (existingItem.rows.length > 0) {
        // Update quantity
        await db.query(
          `UPDATE cart_items 
           SET quantity = quantity + $1 
           WHERE id = $2`,
          [quantity, existingItem.rows[0].id]
        );
        
        // Return updated item
        const result = await db.query(
          `SELECT c.id, c.user_id, c.product_id, c.shop_id, c.quantity, 
                  p.price, p.name as product_name, s.name as shop_name, p.image_url
           FROM cart_items c
           JOIN products p ON c.product_id = p.id
           JOIN shops s ON c.shop_id = s.id
           WHERE c.id = $1`,
          [existingItem.rows[0].id]
        );
        
        return result.rows[0];
      } else {
        // Add new item
        const insertResult = await db.query(
          `INSERT INTO cart_items (user_id, product_id, shop_id, quantity)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [user_id, product_id, shop_id, quantity]
        );
        
        // Return new item
        const result = await db.query(
          `SELECT c.id, c.user_id, c.product_id, c.shop_id, c.quantity, 
                  p.price, p.name as product_name, s.name as shop_name, p.image_url
           FROM cart_items c
           JOIN products p ON c.product_id = p.id
           JOIN shops s ON c.shop_id = s.id
           WHERE c.id = $1`,
          [insertResult.rows[0].id]
        );
        
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error in Cart.addItem:', error);
      throw error;
    }
  },
  
  /**
   * Update cart item quantity
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {boolean} Success
   */
  updateQuantity: async (itemId, quantity) => {
    try {
      await db.query(
        `UPDATE cart_items SET quantity = $1 WHERE id = $2`,
        [quantity, itemId]
      );
      
      return true;
    } catch (error) {
      console.error('Error in Cart.updateQuantity:', error);
      throw error;
    }
  },
  
  /**
   * Update cart item shop (for price comparison)
   * @param {number} itemId - Cart item ID
   * @param {number} shopId - New shop ID
   * @returns {boolean} Success
   */
  updateShop: async (itemId, shopId) => {
    try {
      // Get current cart item
      const cartItem = await db.query(
        `SELECT c.*, p.name as product_name
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.id = $1`,
        [itemId]
      );
      
      if (cartItem.rows.length === 0) {
        throw new Error('Cart item not found');
      }
      
      // Find product in new shop
      const product = await db.query(
        `SELECT id FROM products 
         WHERE name ILIKE $1 AND shop_id = $2
         LIMIT 1`,
        [cartItem.rows[0].product_name, shopId]
      );
      
      if (product.rows.length === 0) {
        throw new Error('Product not available in selected shop');
      }
      
      // Update shop and product
      await db.query(
        `UPDATE cart_items 
         SET shop_id = $1, product_id = $2
         WHERE id = $3`,
        [shopId, product.rows[0].id, itemId]
      );
      
      return true;
    } catch (error) {
      console.error('Error in Cart.updateShop:', error);
      throw error;
    }
  },
  
  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   * @returns {boolean} Success
   */
  removeItem: async (itemId) => {
    try {
      await db.query(
        `DELETE FROM cart_items WHERE id = $1`,
        [itemId]
      );
      
      return true;
    } catch (error) {
      console.error('Error in Cart.removeItem:', error);
      throw error;
    }
  },
  
  /**
   * Clear cart
   * @param {number} userId - User ID
   * @returns {boolean} Success
   */
  clearCart: async (userId) => {
    try {
      await db.query(
        `DELETE FROM cart_items WHERE user_id = $1`,
        [userId]
      );
      
      return true;
    } catch (error) {
      console.error('Error in Cart.clearCart:', error);
      throw error;
    }
  }
};

module.exports = Cart; 