const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Get a single product by ID
router.get('/:id', shopController.getProductById);

module.exports = router; 