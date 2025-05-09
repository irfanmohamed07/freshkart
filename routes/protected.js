const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const Order = require('../models/order');

// Protect all routes
router.use(requireAuth);

// Profile page
router.get('/profile', (req, res) => {
    res.render('profile', { 
        title: 'My Profile',
        user: {
            id: req.session.userId,
            name: req.session.name,
            email: req.session.email,
            isAdmin: req.session.isAdmin
        }
    });
});

// Orders page
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.getUserOrders(req.session.userId);
        res.render('checkout/orders', { 
            title: 'My Orders',
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load orders'
        });
    }
});

// Admin dashboard (only accessible by admin users)
router.get('/admin', (req, res) => {
    // Check if user is admin
    if (!req.session.isAdmin) {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access the admin dashboard.'
        });
    }

    res.render('admin', { 
        title: 'Admin Dashboard',
        user: {
            id: req.session.userId,
            name: req.session.name,
            email: req.session.email,
            isAdmin: req.session.isAdmin
        }
    });
});

module.exports = router; 