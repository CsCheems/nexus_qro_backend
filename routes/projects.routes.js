const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const ROLES = require("../constants/roles");

router.get('/', requireAuth([ROLES.ESTUDIANTE, ROLES.CONSULTOR, ROLES.EMPRENDEDOR]),projectController.getProjects);
router.get('/:id', requireAuth([ROLES.ESTUDIANTE, ROLES.CONSULTOR, ROLES.EMPRENDEDOR]), projectController.getProject)
router.post('/register', requireAuth([ROLES.CONSULTOR, ROLES.EMPRENDEDOR]),projectController.register);
router.put('/update/:id', requireAuth([ROLES.CONSULTOR, ROLES.EMPRENDEDOR]),projectController.update);

module.exports = router;