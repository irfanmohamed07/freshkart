const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Get all shops
router.get('/', shopController.getAllShops);

// Get a single shop by ID with its products
router.get('/:id', shopController.getShopById);

module.exports = router; 