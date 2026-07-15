const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const moduleController = require('../controllers/modules');

router.get('/', authMiddleware, moduleController.getModules);
router.post('/', authMiddleware, moduleController.createModule);
router.put('/:id', authMiddleware, moduleController.updateModule);
router.delete('/:id', authMiddleware, moduleController.deleteModule);
router.get('/usage', authMiddleware, moduleController.getUsage);
router.get('/logs', authMiddleware, moduleController.getLogs);

module.exports = router;
