const pool = require('../config/database');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const getQuotations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM quotations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get quotations error:', error);
    res.status(500).json({ error: 'Failed to get quotations' });
  }
};

const getQuotation = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM quotations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get quotation error:', error);
    res.status(500).json({ error: 'Failed to get quotation' });
  }
};

const createQuotation = async (req, res) => {
  try {
    const { customer_id, items, tax, discount, currency, notes } = req.body;
    
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const total = subtotal + (tax || 0) - (discount || 0);
    const quotationNumber = `QT-${Date.now()}`;
    
    const result = await pool.query(
      'INSERT INTO quotations (user_id, customer_id, quotation_number, items, subtotal, tax, discount, total, currency, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [req.userId, customer_id, quotationNumber, JSON.stringify(items), subtotal, tax || 0, discount || 0, total, currency || 'USD', notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Create quotation error:', error);
    res.status(500).json({ error: 'Failed to create quotation' });
  }
};

const updateQuotation = async (req, res) => {
  try {
    const { items, tax, discount, notes } = req.body;
    
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const total = subtotal + (tax || 0) - (discount || 0);
    
    const result = await pool.query(
      'UPDATE quotations SET items = $1, subtotal = $2, tax = $3, discount = $4, total = $5, notes = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND user_id = $8 RETURNING *',
      [JSON.stringify(items), subtotal, tax || 0, discount || 0, total, notes, req.params.id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update quotation error:', error);
    res.status(500).json({ error: 'Failed to update quotation' });
  }
};

const sendQuotation = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE quotations SET status = $1, sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      ['sent', req.params.id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    logger.info(`Quotation sent: ${req.params.id}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Send quotation error:', error);
    res.status(500).json({ error: 'Failed to send quotation' });
  }
};

const acceptQuotation = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE quotations SET status = $1, accepted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      ['accepted', req.params.id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    logger.info(`Quotation accepted: ${req.params.id}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Accept quotation error:', error);
    res.status(500).json({ error: 'Failed to accept quotation' });
  }
};

const deleteQuotation = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM quotations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    logger.info(`Quotation deleted: ${req.params.id}`);
    res.json({ message: 'Quotation deleted' });
  } catch (error) {
    logger.error('Delete quotation error:', error);
    res.status(500).json({ error: 'Failed to delete quotation' });
  }
};

module.exports = {
  getQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  sendQuotation,
  acceptQuotation,
  deleteQuotation
};
