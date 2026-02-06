const db = require('./db');

/**
 * Appointment model - Database operations for service appointments
 */
const Appointment = {
  /**
   * Create a new appointment
   */
  create: async ({ user_id, shop_id, service_type, appointment_date, appointment_time, vehicle_info, notes, status = 'pending' }) => {
    try {
      const result = await db.query(
        `INSERT INTO appointments (user_id, shop_id, service_type, appointment_date, appointment_time, vehicle_info, notes, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
         RETURNING *`,
        [user_id, shop_id, service_type, appointment_date, appointment_time, vehicle_info, notes, status]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  /**
   * Get appointment by ID
   */
  findById: async (appointmentId) => {
    try {
      const result = await db.query(
        `SELECT a.*, u.name as user_name, u.email as user_email, s.name as shop_name, s.address as shop_address, s.contact as shop_contact
         FROM appointments a
         JOIN users u ON a.user_id = u.id
         JOIN shops s ON a.shop_id = s.id
         WHERE a.id = $1`,
        [appointmentId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  /**
   * Get all appointments for a user
   */
  findByUserId: async (userId) => {
    try {
      const result = await db.query(
        `SELECT a.*, s.name as shop_name, s.address as shop_address, s.contact as shop_contact, s.logo as shop_logo
         FROM appointments a
         JOIN shops s ON a.shop_id = s.id
         WHERE a.user_id = $1
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  /**
   * Get all appointments for a shop
   */
  findByShopId: async (shopId) => {
    try {
      const result = await db.query(
        `SELECT a.*, u.name as user_name, u.email as user_email
         FROM appointments a
         JOIN users u ON a.user_id = u.id
         WHERE a.shop_id = $1
         ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
        [shopId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching shop appointments:', error);
      throw error;
    }
  },

  /**
   * Update appointment status
   */
  updateStatus: async (appointmentId, status) => {
    try {
      const result = await db.query(
        `UPDATE appointments 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [status, appointmentId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  /**
   * Check if time slot is available
   */
  isTimeSlotAvailable: async (shopId, appointmentDate, appointmentTime) => {
    try {
      const result = await db.query(
        `SELECT COUNT(*) as count 
         FROM appointments 
         WHERE shop_id = $1 
         AND appointment_date = $2 
         AND appointment_time = $3 
         AND status IN ('pending', 'confirmed')`,
        [shopId, appointmentDate, appointmentTime]
      );
      return parseInt(result.rows[0].count) === 0;
    } catch (error) {
      console.error('Error checking time slot:', error);
      throw error;
    }
  },

  /**
   * Get available time slots for a date
   */
  getAvailableTimeSlots: async (shopId, appointmentDate) => {
    try {
      // Get booked slots
      const bookedResult = await db.query(
        `SELECT appointment_time 
         FROM appointments 
         WHERE shop_id = $1 
         AND appointment_date = $2 
         AND status IN ('pending', 'confirmed')`,
        [shopId, appointmentDate]
      );
      
      const bookedTimes = bookedResult.rows.map(row => row.appointment_time);
      
      // Generate available time slots (9 AM to 6 PM, every hour)
      const allSlots = [];
      for (let hour = 9; hour <= 18; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00:00`;
        if (!bookedTimes.includes(time)) {
          allSlots.push(time);
        }
      }
      
      return allSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  }
};

module.exports = Appointment;
