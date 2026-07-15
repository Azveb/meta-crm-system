const pool = require('../config/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const getCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE user_id = $1 ORDER BY last_contact_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
};

const getCustomer = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { primary_phone, primary_email, first_name, last_name } = req.body;
    const full_name = `${first_name} ${last_name}`;
    
    const result = await pool.query(
      'INSERT INTO customers (user_id, primary_phone, primary_email, first_name, last_name, full_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.userId, primary_phone, primary_email, first_name, last_name, full_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { primary_phone, primary_email, first_name, last_name, language } = req.body;
    const result = await pool.query(
      'UPDATE customers SET primary_phone = $1, primary_email = $2, first_name = $3, last_name = $4, language = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING *',
      [primary_phone, primary_email, first_name, last_name, language, req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

const getProfile = async (req, res) => {
  try {
    const customer = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    
    if (customer.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const identities = await pool.query(
      'SELECT * FROM customer_identities WHERE customer_id = $1',
      [req.params.id]
    );
    
    const orders = await pool.query(
      'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 10',
      [req.params.id]
    );
    
    res.json({
      ...customer.rows[0],
      identities: identities.rows,
      orders: orders.rows
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const mergeCustomers = async (req, res) => {
  try {
    const { primaryId, secondaryId } = req.body;
    
    // Merge identities
    await pool.query(
      'UPDATE customer_identities SET customer_id = $1 WHERE customer_id = $2',
      [primaryId, secondaryId]
    );
    
    // Merge conversations
    await pool.query(
      'UPDATE conversations SET customer_id = $1 WHERE customer_id = $2',
      [primaryId, secondaryId]
    );
    
    // Delete secondary customer
    await pool.query('DELETE FROM customers WHERE id = $1', [secondaryId]);
    
    logger.info(`Customers merged: ${primaryId} <- ${secondaryId}`);
    res.json({ message: 'Customers merged successfully' });
  } catch (error) {
    logger.error('Merge customers error:', error);
    res.status(500).json({ error: 'Failed to merge customers' });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  getProfile,
  mergeCustomers
};
