const supabase = require('../config/supabase');

async function getVentures(user, userProfile, filters = {}){
    try{
        let query = supabase
            .from("ventures")
            .select("*")
            .order("id", {ascending: false});

        if(user.rol === "emprendor"){
            query = query.eq("perfil_emprendedor_id", userProfile.id);
        }

        if(filters.venture_stage){
            query = query.eq("stage", filters.venture_stage);
        }

        if(filters.requiere_financiamiento){
            query = query.eq("requiere_financiamiento", filters.requiere_financiamiento);
        }

        if(filters.search){
            query = query.ilike("nombre", `%%${filters.search}`);
        }

        const { data, error } = await query;

        if(error){
            throw new Error("Error al obtener emprendimientos");
        }

        return data
        
    }catch(error){
        throw new Error(error.message);
    }
}

async function getVenture(user, userProfile, id) {
    try {
        const { data, error } = await supabase
        .from("ventures")
        .select("*")
        .eq("id", id)
        .single();

        if (error) {
        throw new Error(error.message);
        }

        if (!data) {
        throw new Error("Emprendimiento no encontrado");
        }

        switch (user.rol) {
        case "emprendedor":
            if (data.perfil_emprendedor_id !== userProfile.id) {
            throw new Error("No tienes acceso a este emprendimiento");
            }
            break;

        case "consultor":
        case "administrador":
            break;

        default:
            throw new Error("No autorizado");
        }

        return data;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function register(user, userProfile, ventureData) {
    try{
        if(user.rol !== "emprendedor"){
            throw new Error("Solo usuarios con el rol de emprendedor pueden crear emprendimientos");
        }

        console.log("user:", user);
        console.log("userProfile:", userProfile);

        const {
            nombre,
            descripcion,
            problema_que_resuelve,
            propuesta_valor,
            sector,
            industria,
            pais,
            mercado_objetivo,
            stage,
            requiere_financiamiento,
            monto_estimado_financiamiento,
            tiene_mvp,
            tiene_ventas,
            formalizado,
            fecha_inicio,
            fecha_fin
        } = ventureData;

        if(!nombre || !descripcion || !problema_que_resuelve || !propuesta_valor ||
            !sector || !industria  || !pais || !mercado_objetivo || !stage || !fecha_inicio || !fecha_fin){
                throw new Error("Faltan campos obligatorios");
            }

        if (tiene_mvp === undefined || tiene_ventas === undefined || formalizado === undefined || requiere_financiamiento === undefined) {
            throw new Error("Faltan campos booleanos");
        }

        if (requiere_financiamiento) {
            if (monto_estimado_financiamiento === undefined || monto_estimado_financiamiento === null) {
                throw new Error("Debe especificar el monto de financiamiento");
            }
        }

        const { data, error } = await supabase
            .from('ventures')
            .insert([
                {
                    perfil_emprendedor_id: userProfile.id,
                    nombre,
                    descripcion,
                    problema_que_resuelve,
                    propuesta_valor,
                    sector,
                    industria,
                    pais,
                    mercado_objetivo,
                    stage,
                    requiere_financiamiento,
                    monto_estimado_financiamiento,
                    tiene_mvp,
                    tiene_ventas,
                    formalizado,
                    fecha_inicio,
                    fecha_fin
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

module.exports = {
    getVentures,
    register,
    getVenture
}