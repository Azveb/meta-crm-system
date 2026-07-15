const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const adsController = require('../controllers/ads');

router.get('/campaigns', authMiddleware, adsController.getCampaigns);
router.get('/analytics', authMiddleware, adsController.getAnalytics);
router.get('/recommendations', authMiddleware, adsController.getRecommendations);
router.post('/sync', authMiddleware, adsController.syncCampaigns);

module.exports = router;
