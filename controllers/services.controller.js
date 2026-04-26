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

async function getConsultantsByServiceCode(req, res){
    try{
        const {code} = req.params;
        const result = await servicesService.getConsultantsByServiceCode(code);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getServices,
    getConsultantsByServiceCode
}