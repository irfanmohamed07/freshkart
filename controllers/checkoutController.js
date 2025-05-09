const Cart = require('../models/cart');
const Order = require('../models/order');
const crypto = require('crypto');

/**
 * Checkout controller for handling order processing and payments
 */
const CheckoutController = {
  /**
   * Show checkout page with cart summary
   */
  showCheckout: async (req, res) => {
    try {
      const userId = req.session.userId;
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      
      // Check if cart is empty
      if (!cartItems || cartItems.length === 0) {
        return res.redirect('/cart');
      }
      
      res.render('checkout/index', {
        title: 'Checkout',
        cartItems,
        cartTotal
      });
    } catch (error) {
      console.error('Error in CheckoutController.showCheckout:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load checkout page'
      });
    }
  },
  
  /**
   * Create order and initiate payment
   */
  createOrder: async (req, res) => {
    try {
      const userId = req.session.userId;
      const { address, phone } = req.body;
      
      // Validate inputs
      if (!address || !phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Address and phone number are required' 
        });
      }
      
      // Get cart items and total
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      
      // Check if cart is empty
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Your cart is empty' 
        });
      }
      
      // Create a new order
      const order = await Order.createOrder({
        user_id: userId,
        items: cartItems,
        total_amount: cartTotal,
        shipping_address: address,
        phone,
        payment_status: 'pending'
      });
      
      // Create Razorpay order
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const orderAmount = Math.round(cartTotal * 100); // Razorpay expects amount in paise
      
      // For development without actual Razorpay integration
      if (!razorpayKeyId || process.env.NODE_ENV !== 'production') {
        return res.json({
          success: true,
          order: {
            id: order.id,
            amount: cartTotal,
            currency: 'INR'
          },
          key_id: 'rzp_test_dummy_key', // Dummy key for development
          user: {
            name: req.session.name,
            email: req.session.email,
            phone
          },
          // Flag to indicate we're in development mode
          dev_mode: true
        });
      }
      
      // In production, you would integrate with Razorpay API here
      // This is a simplified example
      // const razorpay = new Razorpay({
      //   key_id: razorpayKeyId,
      //   key_secret: process.env.RAZORPAY_KEY_SECRET
      // });
      
      // const razorpayOrder = await razorpay.orders.create({
      //   amount: orderAmount,
      //   currency: 'INR',
      //   receipt: `order_${order.id}`,
      //   payment_capture: 1
      // });
      
      // Return order details for payment processing
      return res.json({
        success: true,
        order: {
          id: order.id, // In production: razorpayOrder.id
          amount: cartTotal,
          currency: 'INR'
        },
        key_id: razorpayKeyId,
        user: {
          name: req.session.name,
          email: req.session.email,
          phone
        }
      });
    } catch (error) {
      console.error('Error in CheckoutController.createOrder:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create order' 
      });
    }
  },
  
  /**
   * Verify payment and update order status
   */
  verifyPayment: async (req, res) => {
    try {
      // For development mode without actual Razorpay
      if (req.body.dev_mode) {
        const orderId = req.body.order_id;
        
        // Update order status to paid
        await Order.updateOrderStatus(orderId, 'paid');
        
        // Clear the cart after successful payment
        await Cart.clearCart(req.session.userId);
        
        return res.json({ success: true, order_id: orderId });
      }
      
      // In production, verify the payment signature
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        order_id
      } = req.body;
      
      // Verify signature
      const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid payment signature' 
        });
      }
      
      // Update order status to paid
      await Order.updateOrderStatus(order_id, 'paid');
      
      // Clear the cart after successful payment
      await Cart.clearCart(req.session.userId);
      
      return res.json({ success: true, order_id });
    } catch (error) {
      console.error('Error in CheckoutController.verifyPayment:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to verify payment' 
      });
    }
  },
  
  /**
   * Show order confirmation page
   */
  orderConfirmation: async (req, res) => {
    try {
      const { order_id } = req.params;
      const order = await Order.getOrderById(order_id);
      
      if (!order) {
        return res.status(404).render('error', {
          title: 'Error',
          message: 'Order not found'
        });
      }
      
      res.render('checkout/confirmation', {
        title: 'Order Confirmation',
        order
      });
    } catch (error) {
      console.error('Error in CheckoutController.orderConfirmation:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load order confirmation'
      });
    }
  }
};

module.exports = CheckoutController; 