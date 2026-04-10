const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const generateToken = require("../utils/jwt");
const jwt = require("jsonwebtoken");

/* ===LOGIN=== */

async function login(userData){
    try {

        const{email, password} = userData;
    
        if(!email || !password){
            throw new Error("Faltan campos obligatorios");
        }

        const normalizedEmail = email.toLowerCase();
        
        const {data: existingUser, error: searchError} = await supabase
            .from('users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        if(searchError){
            const error = new Error('Error al buscar el usuario');
            error.status = 500;
            throw error;
        }

        if(!existingUser){
            const error = new Error("Credenciales invalidas");
            error.status = 401;
            throw error;
        }

        const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if(!passwordMatch){
            const error = new Error("Credenciales invalidas");
            error.status = 401;
            throw error;
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({
                ultimo_acceso: new Date().toISOString()
            })
            .eq('id', existingUser.id);

        if(updateError){
            console.error("Error actualizando ultimo_acceso:", updateError.message);
        }

        const token = generateToken(existingUser);

        delete existingUser.password;

        return {
            token,
            user: existingUser
        };

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getMe(token){
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { data: usuario, error } = await supabase
            .from("users")
            .select(`*, perfil_estudiante(*), perfil_consultor(*)`)
            .eq("id", decoded.id)
            .single();

        if(error || !usuario){
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        }

        delete usuario.password;

        const perfilMap = {
            estudiante: usuario.perfil_estudiante,
            consultor: usuario.perfil_consultor,
        };

        const perfilValidacion = {
            estudiante: (perfil) => 
                perfil &&
                perfil.universidad &&
                perfil.division &&
                perfil.programa &&
                perfil.experiencia,
            
            consultor: (perfil) =>
                perfil &&
                perfil.empresa &&
                perfil.puesto
        };

        const perfil = perfilMap[usuario.rol] || null;
        const validador = perfilValidacion[usuario.rol];

        let perfilCompleto = true;
        let mensaje = null;

        if(validador){
            perfilCompleto = validador(perfil);
            if(!perfilCompleto){
                mensaje = `Completa la información de tu perfil de ${usuario.rol}`;
            }
        }
        return {
            usuario,
            perfil,
            perfilCompleto,
            mensaje
        };

    }catch(error){
        if ( error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" ) {
            const err = new Error("Token inválido o expirado");
            err.status = 401;
            throw err;
        }
        throw error;
    }
}

async function logout(){
    return true;
}

module.exports = {
    login,
    getMe,
    logout
};