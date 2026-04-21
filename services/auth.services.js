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
            .maybeSingle();

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
            .select(`*, perfil_estudiante(*), perfil_consultor(*), perfil_emprendedor(*), perfil_administrador(*)`)
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
            emprendedor: usuario.perfil_emprendedor,
            administrador: usuario.perfil_administrador
        };

        let perfil = perfilMap[usuario.rol] || null;

        if(usuario.rol === "consultor" && perfil){
            const { data: serviciosConsultor, error: serviciosError} = await supabase
                .from("consultant_services")
                .select(`
                    servicio_id,
                    consulting_services(
                        id, 
                        nombre
                    )
                `)
                .eq("consultor_id", perfil.id);

                 if (serviciosError) {
                    throw new Error("No se pudieron obtener los servicios del consultor");
                }

                 perfil = {
                    ...perfil,
                    servicios:
                    serviciosConsultor?.map((item) => ({
                        id: item.consulting_services.id,
                        nombre: item.consulting_services.nombre,
                    })) || [],
                };
        }

       

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
                perfil.puesto &&
                perfil.diisponibilidad,

            emprendedor: (perfil) =>
                perfil && 
                perfil.sector &&
                perfil.descripcion &&
                perfil.experiencia,

            administrador: (perfil) =>
                perfil &&
                perfil.cargo &&
                perfil.area,

        };

        const validador = perfilValidacion[usuario.rol];

        let perfilCompleto = true;
        let mensaje = null;

        if(validador){
            perfilCompleto = validador(perfil);
            if(!perfilCompleto){
                mensaje = `Completa la información de tu perfil de ${usuario.rol}`;
            }
        }

        usuario.perfil = perfil;

        delete usuario.perfil_estudiante;
        delete usuario.perfil_consultor;
        delete usuario.perfil_emprendedor;
        delete usuario.perfil_empresa;
        delete usuario.perfil_institucion;
        delete usuario.perfil_administrador;

        return {
            usuario,
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