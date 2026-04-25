const ventureService = require('../services/venture.service');
const roadmapService = require('../services/roadmap.service');
const tasksServices = require('../services/tasks.service');
const ROADMAP = require('../constants/roadmap');

async function getVentures(req, res){
    try{
        const result = await ventureService.getVentures(req.user, req.userProfile, req.query);
        return res.json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getVenture(req, res){
    try{
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ID requerido",
            });
        }

        const venture = await ventureService.getVenture(req.user, req.userProfile, id);

        const stage = venture.stage || venture.etapa_actual;

        const tasks = await tasksServices.getTasksByStage(stage, venture.id);

        const roadmap = {
            stage,
            ...ROADMAP[venture.stage],
            tasks
        }

        const result = {
            venture,
            roadmap
        };

        return res.status(200).json(result);

    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}

async function register(req, res) {
    try{
        const result = await ventureService.register(req.user, req.userProfile, req.body);
        return res.status(201).json(result);
    }catch(error){
        return res.status(400).json({
            message: error.message
        });
    }
}

async function createDiagnostic(req, res){
    try{
        const user = req.user;
        const diagnosticData = req.body;
        const profileUser = req.userProfile;

        if (!diagnosticData.validacion_clientes) {
            return res.status(400).json({
                message: "validacion_clientes es requerido"
            });
        }

        if (diagnosticData.tamano_equipo == null) {
            return res.status(400).json({
                message: "tamano_equipo es requerido"
            });
        }

        const {venture_id } = diagnosticData;

        if(!venture_id){
            return res.status(400).json({
                message: "El venture_id es obligatorio"
            });
        }

        const venture = await ventureService.getVenture(user, profileUser, venture_id);

        if(!venture){
            return res.status(400).json({
                message: "Emprendimiento no encontrado"
            });
        }

        if (venture.perfil_emprendedor_id !== profileUser.id) {
            return res.status(403).json({
                message: "No tienes permiso para modificar este emprendimiento"
            });
        }

        const diagnostic = await ventureService.createDiagnostic(diagnosticData);

        return res.status(201).json(diagnostic);

    }catch(error){
        return res.status(400).json({
            message: error.message || "Error al crear diagnostico"
        });
    } 
}

async function calculateStage(req, res) {
    try{
        const { id } = req.params;
        const updatedVenture = await ventureService.calculateStage(id);
        return res.status(200).json(updatedVenture);
    }catch(error){
        return res.status(500).json({
            message: error.message || "Error al calcular etapa"
        });
    } 
}

async function getVentureDiagnostic(req, res){
    try{
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ID requerido",
            });
        }

        const result = await ventureService.getVentureDiagnostic(req.user, req.userProfile, id);
        return res.json(result);

    }catch(error){
        return res.status(500).json({
            message: error.message || "Error al obtner el diagnostico"
        });
    }
}

async function getRoadmap(req, res) {
    try{
        const { id } = req.params;
        if(!id){
            return res.status(400).json({
                message: "ID requerido",
            });
        }

        const venture = await ventureService.getVenture(req.user, req.userProfile, id);

        if(!venture){
            return res.status(404).json({
                message: "Emprendimiento no encontrado"
            });
        }

        const roadmap = roadmapService.getRoadmapByStage(venture.stage);

        const evidences =  await tasksServices.getEvidencesByVentureId(id);

        const tasks = roadmapService.buildTaskWithStatus(roadmap.tasks, evidences);

        return res.json({
            stage: venture.stage,
            objective: roadmap.objective,
            tasks
        });   
    }catch(error){
        return res.status(500).json({
            message: error.message || "Error al obtener roadmap"
        });
    }
}

module.exports = {
    getVentures,
    register, 
    getVenture,
    createDiagnostic,
    calculateStage,
    getVentureDiagnostic,
    getRoadmap
}

