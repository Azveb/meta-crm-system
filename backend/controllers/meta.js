const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const connectAccount = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO meta_accounts (user_id, username, password_hash, is_verified) VALUES ($1, $2, $3, true) RETURNING id, username',
      [req.userId, username, hashedPassword]
    );
    
    logger.info(`Meta account connected for user ${req.userId}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Connect account error:', error);
    res.status(500).json({ error: 'Failed to connect account' });
  }
};

const getAccounts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, is_verified, connected_at, last_sync_at FROM meta_accounts WHERE user_id = $1',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to get accounts' });
  }
};

const getAssets = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, asset_type, asset_name, asset_username, is_synced, last_sync_at FROM connected_assets WHERE user_id = $1 ORDER BY asset_type',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get assets error:', error);
    res.status(500).json({ error: 'Failed to get assets' });
  }
};

const syncAssets = async (req, res) => {
  try {
    // Simulated sync - in production, fetch from Meta API
    const result = await pool.query(
      'UPDATE connected_assets SET last_sync_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *',
      [req.userId]
    );
    logger.info(`Assets synced for user ${req.userId}`);
    res.json({ message: 'Assets synced', assets: result.rows });
  } catch (error) {
    logger.error('Sync assets error:', error);
    res.status(500).json({ error: 'Failed to sync assets' });
  }
};

const disconnectAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    await pool.query(
      'DELETE FROM meta_accounts WHERE id = $1 AND user_id = $2',
      [accountId, req.userId]
    );
    logger.info(`Meta account disconnected: ${accountId}`);
    res.json({ message: 'Account disconnected' });
  } catch (error) {
    logger.error('Disconnect account error:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
};

module.exports = {
  connectAccount,
  getAccounts,
  getAssets,
  syncAssets,
  disconnectAccount
};
