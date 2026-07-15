const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const aiController = require('../controllers/ai');

router.post('/analyze', authMiddleware, aiController.analyzeMessage);
router.post('/generate-response', authMiddleware, aiController.generateResponse);
router.post('/generate-quotation', authMiddleware, aiController.generateQuotation);
router.post('/detect-intent', authMiddleware, aiController.detectIntent);
router.post('/sentiment-analysis', authMiddleware, aiController.sentimentAnalysis);
router.get('/recommendations', authMiddleware, aiController.getRecommendations);

module.exports = router;
