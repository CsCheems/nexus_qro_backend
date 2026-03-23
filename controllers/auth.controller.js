const authService = require('../services/auth.services');

async function register(req, res) {
    try {
        const result = await authService.register(req.body);

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


async function login(req, res) {
    try{
        const result = await authService.login(req.body);
        res.status(200).json({
            message: "Inicio de sesion exitoso",
            token: result.token,
            user: result.token
        });
    }catch(error){
        return res.status(error.status || 500).json({
            message: error.message || "Error interno del servidor"
        });
    }
}


module.exports = {
    register,
    login
}