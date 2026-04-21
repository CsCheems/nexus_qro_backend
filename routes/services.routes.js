const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const ROLES = require('../constants/roles');

router.get('/', requireAuth([ROLES.CONSULTOR]), servicesController.getServices);

module.exports = router;