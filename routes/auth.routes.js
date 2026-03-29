const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const ROLES = require("../constants/roles");
// requireAuth()
// requireAuth([ROLES.ADMIN])
// requireAuth([ROLES.CONSULTOR, ROLES.ADMIN])

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth(), authController.getMe);
router.post('/logout', requireAuth(), authController.logout);

module.exports = router;
