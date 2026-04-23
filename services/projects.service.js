const supabase = require('../config/supabase');

async function getProjects(user, userProfile, filters = {}){
    try{
        let query = supabase
            .from("proyectos")
            .select("*")
            .order("id", {ascending: false});

        if(user.rol === "consultor"){
            query = query.eq("perfil_consultor_id", userProfile.id);
        }

        if(filters.estado){
            query = query.eq("estado", filters.estado);
        }

        if(filters.modalidad){
            query = query.eq("modalidad", filters.modalidad);
        }

        if(filters.search){
            query = query.ilike("nombre_proyecto", `%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error("Error al obtener proyectos");
        }

        return data;
    }catch(error){
        throw new Error(error.message);
    }
}

async function getProject(user) {
    
}

async function register (user, userProfile, projectData){
    try{

        // console.log("PERMISOS!", user.rol);
        // if(user.rol !== "consultor" || user.rol !== "emprendedor"){
        //     throw new Error("Solo usuarios con el rol consultor o emprendedor pueden crear proyectos");
        // }

        const {
            nombre_proyecto,
            descripcion,
            apoyo_economico,
            fecha_inicio,
            fecha_fin,
            estado,
            modalidad,
            requisitos,
            beneficios,
            contacto_email,
            contacto_telefono,
            venture_id
        } = projectData;

        if(!nombre_proyecto || !descripcion || apoyo_economico === undefined 
            || !fecha_inicio || !fecha_fin || !estado || !modalidad 
            || !contacto_email || !contacto_telefono){
                throw new Error("Faltan campos obligatorios");
        }

        const {data, error} = await supabase
            .from('proyectos')
            .insert([
                {
                    perfil_consultor_id: userProfile.id,
                    nombre_proyecto, 
                    descripcion,
                    apoyo_economico,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    modalidad,
                    requisitos,
                    beneficios,
                    contacto_email: contacto_email.toLowerCase(),
                    contacto_telefono,
                    venture_id
                }
            ])
            .select()
            .single();

            if(error){
                throw new Error(error.message);
            }

            return data;
    }catch(error){
        throw new Error(error.message);
    }
}

async function update(user, id, projectData){
    try{
        if(user.rol !== "consultor"){
            const err = new Error("Solo los consultores pueden actualizar proyectos");
            err.status = 403;
            throw err;
        }

        const {data: proyecto, error: searchError} = await supabase
            .from("proyectos")
            .select("*")
            .eq("id", id)
            .single();

        if(searchError || !proyecto){
            const err = new Error("Proyecto no encontrado");
            err.status = 404;
            throw err;
        }

        if(proyecto.perfil_consultor_id !== user.id){
            const err = new Error("No tienes permisos para actualizar este proyecto");
            err.status = 403;
            throw err;
        }

        if ("perfil_consultor_id" in projectData) {
            delete projectData.perfil_consultor_id;
        }

        const {data, error} = await suspabase
            .from("proyectos")
            .update(projectData)
            .eq("id", id)
            select()
            .single();

        if(error){
            const err = new Error(error.message);
            err.status = 500;
            throw err;
        }

        return data;
    }catch(error){
        throw new Error(error.message);
    }
}

module.exports = {
    getProjects,
    register,
    update
}