const userService = require('../services/users.service');

async function register(req, res) {
    try {
        const result = await userService.register(req.body);

        res.status(201).json({
            message: "Usuario registrado con exito",
            user: result.user,
            token: result.token
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

async function update(req, res){
    try{
        await userService.update(req.user.id, req.body);
        res.status(201).json({
            message: "Informacion actualizada",
        });
    }catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    register, 
    update
}