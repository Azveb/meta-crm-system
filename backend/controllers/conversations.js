const pool = require('../config/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const getConversations = async (req, res) => {
  try {
    const { status, platform } = req.query;
    let query = 'SELECT * FROM conversations WHERE user_id = $1';
    const params = [req.userId];
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (platform) {
      query += ` AND platform = $${params.length + 1}`;
      params.push(platform);
    }
    
    query += ' ORDER BY last_message_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

const getConversation = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const addMessage = async (req, res) => {
  try {
    const { message_text, attachments } = req.body;
    const { id: conversationId } = req.params;
    
    // Get conversation
    const convResult = await pool.query(
      'SELECT customer_id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, req.userId]
    );
    
    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const customerId = convResult.rows[0].customer_id;
    
    // Add message
    const result = await pool.query(
      'INSERT INTO messages (conversation_id, customer_id, sender_type, message_text, attachments) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [conversationId, customerId, 'human', message_text, JSON.stringify(attachments || [])]
    );
    
    // Update conversation
    await pool.query(
      'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP, last_message_from = $1, message_count = message_count + 1 WHERE id = $2',
      ['human', conversationId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Add message error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

const updateConversation = async (req, res) => {
  try {
    const { status, priority, assigned_to } = req.body;
    const result = await pool.query(
      'UPDATE conversations SET status = $1, priority = $2, assigned_to = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [status, priority, assigned_to, req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update conversation error:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

const transferToHuman = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE conversations SET assigned_to = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [req.userId, 'pending', req.params.id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Transfer to human error:', error);
    res.status(500).json({ error: 'Failed to transfer conversation' });
  }
};

module.exports = {
  getConversations,
  getConversation,
  addMessage,
  getMessages,
  updateConversation,
  transferToHuman
};
