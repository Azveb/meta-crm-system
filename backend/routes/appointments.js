const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const appointmentController = require('../controllers/appointments');

router.get('/', authMiddleware, appointmentController.getAppointments);
router.get('/:id', authMiddleware, appointmentController.getAppointment);
router.post('/', authMiddleware, appointmentController.createAppointment);
router.put('/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);
router.post('/:id/remind', authMiddleware, appointmentController.sendReminder);

module.exports = router;
