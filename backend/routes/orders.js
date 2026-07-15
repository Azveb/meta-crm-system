const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const orderController = require('../controllers/orders');

router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrder);
router.post('/', authMiddleware, orderController.createOrder);
router.put('/:id', authMiddleware, orderController.updateOrder);
router.put('/:id/status', authMiddleware, orderController.updateStatus);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;
