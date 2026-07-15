const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const conversationController = require('../controllers/conversations');

router.get('/', authMiddleware, conversationController.getConversations);
router.get('/:id', authMiddleware, conversationController.getConversation);
router.post('/:id/messages', authMiddleware, conversationController.addMessage);
router.get('/:id/messages', authMiddleware, conversationController.getMessages);
router.put('/:id', authMiddleware, conversationController.updateConversation);
router.post('/:id/transfer', authMiddleware, conversationController.transferToHuman);

module.exports = router;
