const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate, schemas } = require('../utils/validators');

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
