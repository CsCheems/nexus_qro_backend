const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const ROLES = require("../constants/roles");

router.get('/', requireAuth([ROLES.ESTUDIANTE, ROLES.CONSULTOR]),projectController.getProjects);
router.get('/:id', requireAuth([ROLES.ESTUDIANTE, ROLES.CONSULTOR]), projectController.getProject)
router.post('/register', requireAuth([ROLES.CONSULTOR]),projectController.register);
router.put('/update/:id', requireAuth([ROLES.CONSULTOR]),projectController.update);

module.exports = router;