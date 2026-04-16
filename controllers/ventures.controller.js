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

module.exports = {
    getVentures,
    register, 
    getVenture
}

