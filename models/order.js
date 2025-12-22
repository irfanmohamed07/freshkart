const db = require('./db');

/**
 * Order model - Database operations for orders
 */
const Order = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @param {number} orderData.user_id - User ID
   * @param {Array} orderData.items - Array of cart items
   * @param {number} orderData.total_amount - Total order amount
   * @param {string} orderData.payment_status - Payment status (default: 'pending')
   * @param {string} orderData.shipping_address - Shipping address (optional)
   * @param {string} orderData.phone - Phone number (optional)
   * @param {string} orderData.razorpay_order_id - Razorpay order ID (optional)
   * @param {string} orderData.razorpay_payment_id - Razorpay payment ID (optional)
   * @returns {Promise<Object>} Created order
   */
  createOrder: async ({ user_id, items, total_amount, payment_status = 'pending', shipping_address = null, phone = null, razorpay_order_id = null, razorpay_payment_id = null }) => {
    try {
      // Start transaction by creating order
      const orderResult = await db.query(
        `INSERT INTO orders (user_id, total_amount, payment_status, shipping_address, phone, razorpay_order_id, razorpay_payment_id, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
         RETURNING *`,
        [user_id, total_amount, payment_status, shipping_address, phone, razorpay_order_id, razorpay_payment_id]
      );
      
      const order = orderResult.rows[0];
      const orderId = order.id;
      
      // Insert order items
      for (const item of items) {
        await db.query(
          `INSERT INTO order_items (order_id, product_id, shop_id, quantity, price, created_at) 
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [orderId, item.product_id, item.shop_id, item.quantity, item.price]
        );
      }
      
      // Create initial order tracking entry
      await db.query(
        `INSERT INTO order_tracking (order_id, status, updated_at) 
         VALUES ($1, $2, NOW())`,
        [orderId, payment_status === 'paid' ? 'confirmed' : 'pending']
      );
      
      return order;
    } catch (error) {
      console.error('Error in Order.createOrder:', error);
      throw error;
    }
  },
  
  /**
   * Get order by ID with items and tracking
   * @param {number} orderId - Order ID
   * @returns {Promise<Object|null>} Order with items and tracking
   */
  getOrderById: async (orderId) => {
    try {
      // Get order details
      const orderResult = await db.query(
        `SELECT o.*, u.name as user_name, u.email as user_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = $1`,
        [orderId]
      );
      
      if (orderResult.rows.length === 0) {
        return null;
      }
      
      const order = orderResult.rows[0];
      
      // Get order items with product and shop details
      const itemsResult = await db.query(
        `SELECT oi.*, p.name as product_name, p.image_url, s.name as shop_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN shops s ON oi.shop_id = s.id
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [orderId]
      );
      
      // Get order tracking history
      const trackingResult = await db.query(
        `SELECT * FROM order_tracking 
         WHERE order_id = $1 
         ORDER BY updated_at DESC`,
        [orderId]
      );
      
      return {
        ...order,
        items: itemsResult.rows,
        tracking: trackingResult.rows
      };
    } catch (error) {
      console.error('Error in Order.getOrderById:', error);
      throw error;
    }
  },
  
  /**
   * Get all orders for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User orders with current status
   */
  getUserOrders: async (userId) => {
    try {
      // Get orders with latest tracking status
      const result = await db.query(
        `SELECT o.*, 
                (SELECT status FROM order_tracking 
                 WHERE order_id = o.id 
                 ORDER BY updated_at DESC 
                 LIMIT 1) as current_status
         FROM orders o
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error in Order.getUserOrders:', error);
      throw error;
    }
  },
  
  /**
   * Update order payment status
   * @param {number} orderId - Order ID
   * @param {string} status - Payment status ('pending', 'paid', 'failed')
   * @param {string} razorpay_payment_id - Razorpay payment ID (optional)
   * @returns {Promise<Object>} Updated order
   */
  updateOrderStatus: async (orderId, status, razorpay_payment_id = null) => {
    try {
      // Update order payment status
      const updateFields = ['payment_status = $1'];
      const updateValues = [status];
      
      if (razorpay_payment_id) {
        updateFields.push('razorpay_payment_id = $2');
        updateValues.push(razorpay_payment_id);
      }
      
      const orderResult = await db.query(
        `UPDATE orders 
         SET ${updateFields.join(', ')} 
         WHERE id = $${updateValues.length + 1}
         RETURNING *`,
        [...updateValues, orderId]
      );
      
      if (orderResult.rows.length === 0) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      // Add tracking entry
      const trackingStatus = status === 'paid' ? 'confirmed' : status;
      await db.query(
        `INSERT INTO order_tracking (order_id, status, updated_at) 
         VALUES ($1, $2, NOW())`,
        [orderId, trackingStatus]
      );
      
      return orderResult.rows[0];
    } catch (error) {
      console.error('Error in Order.updateOrderStatus:', error);
      throw error;
    }
  },
  
  /**
   * Update order tracking status
   * @param {number} orderId - Order ID
   * @param {string} status - Tracking status (e.g., 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
   * @returns {Promise<Object>} New tracking entry
   */
  updateTrackingStatus: async (orderId, status) => {
    try {
      const result = await db.query(
        `INSERT INTO order_tracking (order_id, status, updated_at) 
         VALUES ($1, $2, NOW()) 
         RETURNING *`,
        [orderId, status]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in Order.updateTrackingStatus:', error);
      throw error;
    }
  },
  
  /**
   * Get order items for an order
   * @param {number} orderId - Order ID
   * @returns {Promise<Array>} Order items with product and shop details
   */
  getOrderItems: async (orderId) => {
    try {
      const result = await db.query(
        `SELECT oi.*, p.name as product_name, p.image_url, s.name as shop_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN shops s ON oi.shop_id = s.id
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [orderId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error in Order.getOrderItems:', error);
      throw error;
    }
  },
  
  /**
   * Get order tracking history
   * @param {number} orderId - Order ID
   * @returns {Promise<Array>} Tracking history
   */
  getOrderTracking: async (orderId) => {
    try {
      const result = await db.query(
        `SELECT * FROM order_tracking 
         WHERE order_id = $1 
         ORDER BY updated_at DESC`,
        [orderId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error in Order.getOrderTracking:', error);
      throw error;
    }
  }
};

module.exports = Order;
