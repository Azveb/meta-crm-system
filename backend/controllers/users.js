const pool = require('../config/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const getProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, business_name, phone, timezone, language FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { business_name, phone, timezone, language } = req.body;
    const result = await pool.query(
      'UPDATE users SET business_name = $1, phone = $2, timezone = $3, language = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [business_name, phone, timezone, language, req.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const conversationsCount = await pool.query(
      'SELECT COUNT(*) FROM conversations WHERE user_id = $1',
      [req.userId]
    );
    
    const customersCount = await pool.query(
      'SELECT COUNT(*) FROM customers WHERE user_id = $1',
      [req.userId]
    );
    
    const ordersTotal = await pool.query(
      'SELECT SUM(total) as total FROM orders WHERE user_id = $1 AND status != \'cancelled\'',
      [req.userId]
    );
    
    const openConversations = await pool.query(
      'SELECT COUNT(*) FROM conversations WHERE user_id = $1 AND status = \'open\'',
      [req.userId]
    );
    
    res.json({
      conversations: parseInt(conversationsCount.rows[0].count),
      customers: parseInt(customersCount.rows[0].count),
      totalRevenue: ordersTotal.rows[0].total || 0,
      openConversations: parseInt(openConversations.rows[0].count)
    });
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboard
};
