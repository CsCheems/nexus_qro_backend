const supabase = require('../config/supabase');

async function getServices(){
    try{
        let query = supabase
            .from("consulting_services")
            .select("*")
            .order("id", {ascending: false});

        const { data, error } = await query;

        if(error){
            throw new Error("Error al obtener servicios");
        }

        return data;
        
    }catch(error){
        throw new Error(error.message);
    }
}

async function getConsultantsByServiceCode(code) {
  try {

    console.log(code);
    const { data: service, error: serviceError } = await supabase
        .from("consulting_services")
        .select("id, nombre")
        .eq("code", code)
        .single();

    if (serviceError || !service) {
        throw new Error("Servicio no encontrado");
    }

    const { data: consultantsData, error: consultantsError } = await supabase
        .from("consultant_services")
        .select(`
        consultor_id,
        anios_experiencia,
        tarifa_por_hora,
        perfil_consultor (
            id,
            puesto,
            empresa,
            usuario:usuario_id (
            nombres,
            apellido_paterno,
            apellido_materno
            )
        )
        `)
        .eq("servicio_id", service.id);

    if (consultantsError) {
        throw new Error("Error al obtener consultores");
    }

    const consultants = consultantsData.map((item) => {
        const usuario = item.perfil_consultor?.usuario;

        return {
        consultant_id: item.consultor_id,
        nombre: usuario
            ? `${usuario.nombres} ${usuario.apellido_paterno}`
            : "Sin nombre",
        empresa: item.perfil_consultor?.empresa || "",
        puesto: item.perfil_consultor?.puesto || "",
        anios_experiencia: item.anios_experiencia,
        tarifa_por_hora: item.tarifa_por_hora,
        servicio: service.nombre,
        };
    });

    return {
        service,
        consultants,
    };

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getServices,
    getConsultantsByServiceCode
}

