const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);

// Signup routes
router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.signup);

// Logout route
router.get('/logout', authController.logout);

module.exports = router; 