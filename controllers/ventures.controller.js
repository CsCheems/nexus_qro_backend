const ventureService = require('../services/venture.service');

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

        const result = await ventureService.getVenture(req.user, req.userProfile, id);
        return res.json(result);
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

        const {venture_id} = diagnosticData;

        if(!venture_id){
            return res.status(400).json({
                message: "El venture_id es obligatorio"
            });
        }

        const venture = await ventureService.getVenture(venture_id);

        if(!venture){
            return res.status(400).json({
                message: "Emprendimiento no encontrado"
            });
        }

        if (venture.perfil_emprendedor_id !== user.profileId) {
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

module.exports = {
    getVentures,
    register, 
    getVenture,
    createDiagnostic,
    calculateStage
}

