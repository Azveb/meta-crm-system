const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const quotationController = require('../controllers/quotations');

router.get('/', authMiddleware, quotationController.getQuotations);
router.get('/:id', authMiddleware, quotationController.getQuotation);
router.post('/', authMiddleware, quotationController.createQuotation);
router.put('/:id', authMiddleware, quotationController.updateQuotation);
router.post('/:id/send', authMiddleware, quotationController.sendQuotation);
router.post('/:id/accept', authMiddleware, quotationController.acceptQuotation);
router.delete('/:id', authMiddleware, quotationController.deleteQuotation);

module.exports = router;
