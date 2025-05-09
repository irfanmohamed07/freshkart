const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { requireAuth } = require('../middlewares/auth');

// Apply authentication middleware to checkout routes except confirmation (for testing)
router.use(/^(?!\/confirmation).*$/, requireAuth);

// Show checkout page
router.get('/', checkoutController.showCheckout);

// Create order and initiate payment
router.post('/create-order', checkoutController.createOrder);

// Verify payment
router.post('/verify-payment', checkoutController.verifyPayment);

// Order confirmation page - allowing this without auth for testing
router.get('/confirmation/:order_id', checkoutController.orderConfirmation);

module.exports = router; 