const supabase = require('../config/supabase');
const {STAGES_ORDER} = require('../constants/roadmap');

async function getVentures(user, userProfile, filters = {}){
    try{
        let query = supabase
            .from("ventures")
            .select("*")
            .order("id", {ascending: false});

        if(user.rol === "emprendedor"){
            query = query.eq("perfil_emprendedor_id", userProfile.id);
        }

        if(filters.venture_stage){
            query = query.eq("stage", filters.venture_stage);
        }

        if(filters.search){
            query = query.ilike("nombre", `%${filters.search}%`);
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
        const { data: venture, error } = await supabase
        .from("ventures")
        .select(`
                 *,
                proyectos:proyectos (
                id,
                nombre_proyecto,
                descripcion,
                estado,
                modalidad,
                fecha_inicio,
                fecha_fin,
                venture_id
                )
            `)
        .eq("id", id)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!venture) {
            throw new Error("Emprendimiento no encontrado");
        }

        switch (user.rol) {
            case "emprendedor":
                if (venture.perfil_emprendedor_id !== userProfile.id) {
                throw new Error("No tienes acceso a este emprendimiento");
                }
                break;

            case "consultor":
            case "administrador":
                break;

            default:
                throw new Error("No autorizado");
        }

        return venture;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function register(user, userProfile, ventureData) {
    try{
        if(user.rol !== "emprendedor"){
            throw new Error("Solo usuarios con el rol de emprendedor pueden crear emprendimientos");
        }

        const {
            nombre,
            descripcion,
            problema_que_resuelve,
            propuesta_valor,
            sector,
            industria,
            pais,
            fecha_inicio,
            fecha_fin
        } = ventureData;

        if(!nombre || !descripcion || !problema_que_resuelve || !propuesta_valor ||
            !sector || !industria  || !pais || !fecha_inicio){
                throw new Error("Faltan campos obligatorios");
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
                    stage: "Idea",
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

async function createDiagnostic(diagnosticData) {
    try {
        const {
            venture_id,
            tamano_equipo,
            tiene_ventas,
            tiene_mvp,
            formalizado,
            tipo_cliente_objetivo,
            alcance_geografico,
            validacion_clientes,
            sitio_web_url,
            requiere_financiamiento,
            monto_estimado_financiamiento
        } = diagnosticData;

        if (
            !venture_id ||
            tamano_equipo === undefined ||
            tiene_ventas === undefined ||
            tiene_mvp === undefined ||
            formalizado === undefined ||
            !tipo_cliente_objetivo ||
            !alcance_geografico ||
            !validacion_clientes
        ) {
            throw new Error("Faltan campos obligatorios en el diagnóstico");
        }

        const { data: existing } = await supabase
        .from('venture_diagnostico_general')
        .select('*')
        .eq('venture_id', venture_id)
        .single();

        if(existing){
            throw new Error("El diagnóstico ya existe para este emprendimiento");
        }

        const { data, error } = await supabase
        .from('venture_diagnostico_general')
        .insert([
            {
            venture_id,
            tamano_equipo,
            tiene_ventas,
            tiene_mvp,
            formalizado,
            tipo_cliente_objetivo,
            alcance_geografico,
            validacion_clientes,
            sitio_web_url,
            requiere_financiamiento,
            monto_estimado_financiamiento
            }
        ])
        .select()
        .single();

        if (error) {
        throw new Error(error.message);
        }

        return data;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function calculateStage(ventureId) {
    try {
        const { data: diagnostic, error: diagError } = await supabase
        .from('venture_diagnostico_general')
        .select('*')
        .eq('venture_id', ventureId)
        .single();

        if (diagError || !diagnostic) {
            throw new Error("Diagnóstico no encontrado");
        }

        let stage = "Idea";

        if (!diagnostic.tiene_mvp) {
            stage = "Idea";

        } else if (diagnostic.tiene_mvp && diagnostic.validacion_clientes === "baja") {
            stage = "Validación";

        } else if (diagnostic.tiene_ventas && !diagnostic.formalizado) {
            stage = "Modelo de Negocio";

        } else if (diagnostic.formalizado && diagnostic.validacion_clientes === "media") {
            stage = "Comercialización";

        } else if (diagnostic.formalizado && diagnostic.validacion_clientes === "alta") {
            stage = "Operación";
        }

        const { data: updated, error: updateError } = await supabase
        .from('ventures')
        .update({ stage })
        .eq('id', ventureId)
        .select()
        .single();

        if (updateError) {
        throw new Error(updateError.message);
        }

        return updated;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getVentureDiagnostic(user, userProfile, id) {
    try {
        const { data, error } = await supabase
        .from("venture_diagnostico_general")
        .select("*")
        .eq("venture_id", id)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            throw new Error("Diagnostico no encontrado");
        }
        return data;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getVentureStage(user, userProfile, id) {
    try {
        const { data, error } = await supabase
        .from("ventures")
        .select("stage, perfil_emprendedor_id")
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

async function advanceVentureStage(ventureId, currentStage){
    try{
        const currentIndex = STAGES_ORDER.indexOf(currentStage);

        if(currentIndex === -1 || currentIndex === STAGES_ORDER.length - 1){
            return;
        }

        const nextStage = STAGES_ORDER[currentIndex + 1];

        const { error } = await supabase
            .from("ventures")
            .update({stage: nextStage})
            .eq("id", ventureId);

        if(error) throw error;

    }catch(error){
        throw new Error(error.message);
    }
}


module.exports = {
    getVentures,
    register,
    getVenture,
    calculateStage, 
    createDiagnostic,
    getVentureDiagnostic,
    getVentureStage,
    advanceVentureStage
}