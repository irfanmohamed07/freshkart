/**
 * Export all models from a single file
 */
const User = require('./user');
const Shop = require('./shop');
const Product = require('./product');
const Cart = require('./cart');
const Order = require('./order');
const db = require('./db');

module.exports = {
  User,
  Shop,
  Product,
  Cart,
  Order,
  db
}; 