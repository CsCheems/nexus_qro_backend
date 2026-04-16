const express = require('express');
const router = express.Router();
const venturesController = require('../controllers/ventures.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const ROLES = require("../constants/roles");

router.get('/', requireAuth([ROLES.EMPRENDEDOR, ROLES.CONSULTOR, ROLES.ADMIN]),venturesController.getVentures);
router.get('/:id', requireAuth([ROLES.EMPRENDEDOR, ROLES.CONSULTOR, ROLES.ADMIN]), venturesController.getVenture)
router.post('/register', requireAuth([ROLES.EMPRENDEDOR]),venturesController.register);
//router.put('/update/:id', requireAuth([ROLES.CONSULTOR, ROLES.EMPRENDEDOR, ROLES.ADMIN]),venturesController.update);

module.exports = router;
