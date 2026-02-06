const Appointment = require('../models/appointment');
const Shop = require('../models/shop');

/**
 * Booking controller
 */
const BookingController = {
  /**
   * Show booking form for a shop
   */
  showBookingForm: async (req, res) => {
    try {
      const shopId = req.params.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res.status(404).render('404', {
          title: 'Shop Not Found'
        });
      }

      res.render('booking/form', {
        title: `Book Service - ${shop.name}`,
        shop,
        user: req.session.userId ? { id: req.session.userId, name: req.session.name, email: req.session.email } : null
      });
    } catch (error) {
      console.error('Error showing booking form:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load booking form. Please try again later.'
      });
    }
  },

  /**
   * Get available time slots for a date
   */
  getAvailableSlots: async (req, res) => {
    try {
      const { shopId, date } = req.query;

      if (!shopId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID and date are required'
        });
      }

      const slots = await Appointment.getAvailableTimeSlots(shopId, date);

      res.json({
        success: true,
        slots: slots.map(slot => {
          const [hours, minutes] = slot.split(':');
          return {
            time: slot,
            display: `${parseInt(hours)}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`
          };
        })
      });
    } catch (error) {
      console.error('Error getting available slots:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available time slots'
      });
    }
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (req, res) => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Please login to book an appointment'
        });
      }

      const { shop_id, service_type, appointment_date, appointment_time, vehicle_info, notes } = req.body;

      // Validate inputs
      if (!shop_id || !service_type || !appointment_date || !appointment_time) {
        return res.status(400).json({
          success: false,
          message: 'Please fill all required fields'
        });
      }

      // Check if time slot is available
      const isAvailable = await Appointment.isTimeSlotAvailable(shop_id, appointment_date, appointment_time);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked. Please choose another time.'
        });
      }

      // Create appointment
      const appointment = await Appointment.create({
        user_id: userId,
        shop_id,
        service_type,
        appointment_date,
        appointment_time,
        vehicle_info: vehicle_info || null,
        notes: notes || null,
        status: 'pending'
      });

      res.json({
        success: true,
        message: 'Appointment booked successfully!',
        appointment
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to book appointment. Please try again later.'
      });
    }
  },

  /**
   * Get user's appointments
   */
  getUserAppointments: async (req, res) => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.redirect('/login');
      }

      const appointments = await Appointment.findByUserId(userId);

      res.render('booking/list', {
        title: 'My Appointments',
        appointments,
        user: { id: userId, name: req.session.name, email: req.session.email }
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load appointments. Please try again later.'
      });
    }
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (req, res) => {
    try {
      const userId = req.session.userId;
      const appointmentId = req.params.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Please login to cancel appointment'
        });
      }

      // Check if appointment belongs to user
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || appointment.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to cancel this appointment'
        });
      }

      // Update status
      await Appointment.updateStatus(appointmentId, 'cancelled');

      res.json({
        success: true,
        message: 'Appointment cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel appointment. Please try again later.'
      });
    }
  }
};

module.exports = BookingController;
