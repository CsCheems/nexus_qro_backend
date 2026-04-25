const projectService = require('../services/projects.service');

async function getProjects(req, res){
    try{
        const result = await projectService.getProjects(req.user, req.userProfile, req.query);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getProject(req, res){
    try{
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ID requerido",
            });
        }

        const result = await projectService.getProject(req.user, req.userProfile, id);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}

async function register(req, res) {
    try{
        const result = await projectService.register(req.user, req.userProfile, req.body);
        return res.status(201).json(result);
    }catch(error){
        return res.status(400).json({
            message: error.message
        });
    }
}

async function update(req, res){
    try{
        const {id} = req.params;
        const result = await projectService.update(id, req.body);
        return res.json(result);
    }catch(error){
        return res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    getProjects,
    getProject,
    register,
    update
}