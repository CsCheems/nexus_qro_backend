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

module.exports = {
    getServices
}