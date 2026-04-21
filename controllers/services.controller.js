const servicesService = require('../services/services.service');

async function getServices(req, res){
    try{
        const result = await servicesService.getServices();
        return res.json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getServices
}