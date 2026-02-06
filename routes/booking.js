const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middlewares/auth');

// Show booking form
router.get('/shop/:shopId', BookingController.showBookingForm);

// Get available time slots (AJAX)
router.get('/slots', BookingController.getAvailableSlots);

// Create appointment (requires auth)
router.post('/create', requireAuth, BookingController.createAppointment);

// Get user appointments (requires auth)
router.get('/my-appointments', requireAuth, BookingController.getUserAppointments);

// Cancel appointment (requires auth)
router.post('/cancel/:id', requireAuth, BookingController.cancelAppointment);

module.exports = router;
