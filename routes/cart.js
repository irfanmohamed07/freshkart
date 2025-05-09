const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middlewares/auth');

// Apply authentication middleware to all cart routes
router.use(requireAuth);

// View cart
router.get('/', cartController.viewCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.post('/update-quantity', cartController.updateQuantity);

// Update cart item shop (for price comparison)
router.post('/update-shop', cartController.updateShop);

// Remove item from cart
router.post('/remove', cartController.removeItem);

// Clear cart
router.post('/clear', cartController.clearCart);

module.exports = router; 