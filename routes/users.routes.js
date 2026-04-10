const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/register', usersController.register);

module.exports = router;