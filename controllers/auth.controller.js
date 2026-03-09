const authService = require('../services/auth.services');

async function register(req, res) {
    console.log(req.body);
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

module.exports = {
    register
}