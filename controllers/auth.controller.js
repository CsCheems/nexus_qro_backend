const authService = require('../services/auth.services');

async function login(req, res) {
    try{
        const { token, user } = await authService.login(req.body);

        res.clearCookie("token");

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       
            sameSite: "none",
        });

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: user
        });

    }catch(error){
        return res.status(error.status || 500).json({
            message: error.message || "Error interno del servidor"
        });
    }
}

async function getMe(req, res){
    try{
        const token = req.cookies.token;
        const usuario = await authService.getMe(token);

        return res.status(200).json({
            usuario
        });

    }catch(error){
        return res.status(error.status || 401).json({
            message: error.message
        });
    }
}

async function logout(req, res){
    try{
        await authService.logout();

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            message: "Sesión cerrada correctamente"
        });

    }catch(error){
        return res.status(500).json({
            message: "Error al cerrar sesión"
        });
    }
}


module.exports = {
    login,
    getMe,
    logout
}