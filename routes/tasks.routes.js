const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const ROLES = require("../constants/roles");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post('/evidences', requireAuth([ROLES.EMPRENDEDOR]),tasksController.createEvidence);
router.get('/evidences/:ventureId/:taskKey', requireAuth([ROLES.EMPRENDEDOR]), tasksController.getEvidencesByTask);
router.post('/evidences/upload', requireAuth([ROLES.EMPRENDEDOR]), upload.single("file"), tasksController.uploadEvidenceFile);
router.patch('/:id/complete', requireAuth([ROLES.EMPRENDEDOR, ROLES.CONSULTOR, ROLES.ADMIN]), tasksController.completeTask);

module.exports = router;