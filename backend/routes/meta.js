const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const metaController = require('../controllers/meta');

router.post('/connect', authMiddleware, metaController.connectAccount);
router.get('/accounts', authMiddleware, metaController.getAccounts);
router.get('/assets', authMiddleware, metaController.getAssets);
router.post('/sync', authMiddleware, metaController.syncAssets);
router.delete('/disconnect/:accountId', authMiddleware, metaController.disconnectAccount);

module.exports = router;
