const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const customerController = require('../controllers/customers');

router.get('/', authMiddleware, customerController.getCustomers);
router.get('/:id', authMiddleware, customerController.getCustomer);
router.post('/', authMiddleware, customerController.createCustomer);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.get('/:id/profile', authMiddleware, customerController.getProfile);
router.post('/merge', authMiddleware, customerController.mergeCustomers);

module.exports = router;
