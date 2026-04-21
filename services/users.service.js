const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const generateToken = require("../utils/jwt");

/* ===REGISTER=== */ 

async function register(userData){
    try{
        const{
            name, 
            lastName, 
            secondLastName, 
            email, 
            phone, 
            role, 
            password
        } = userData;

        if(!name || !lastName || !email || !phone || !password || !role){
            throw new Error("Faltan campos obligatorios");
        }

        const {data: existingUser, error: searchError} = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

         if(searchError){
            throw new Error(searchError.message);
        }

        if(existingUser){
            throw new Error('El email ya esta registrado a otro usuario');
        }

        const user = await createUser(userData);

        switch(role){
            case "estudiante":
                await createStudentProfile(user.id);
                break;
            case "consultor":
                await createConsultantProfile(user.id);
                break;
            case "emprendedor":
                await createVentureProfile(user.id);
                break;
            case "institucion":
                await createInstituteProfile(user.id);
                break;
            case "empresa": 
                await createEnterpriseProfile(user.id);
                break;
            default: 
                break;
        }

        const token = generateToken(user);

        delete user.password;

        return{
            user,
            token
        }

    }catch(e){
        throw new Error(e.message);
    }
}

async function createUser(userData){
    const{
        name,
        lastName,
        secondLastName,
        email,
        phone,
        role,
        password
    } = userData;

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error} = await supabase
        .from('users')
        .insert([
            {
                nombres: name,
                apellido_paterno: lastName,
                apellido_materno: secondLastName,
                email: normalizedEmail,
                telefono: phone,
                rol: role,
                password: hashedPassword
            }
        ])
        .select()
        .single();

        if(error){
            throw new Error(error.message);
        }

        return data;
}

async function createStudentProfile(userId) {
    const { error } = await supabase
        .from("perfil_estudiante")
        .insert([
            {
                usuario_id: userId
            }
        ]);

        if(error){
            throw new Error(error.message);
        }
}

async function createConsultantProfile(userId) {
    const { error } = await supabase
        .from("perfil_consultor")
        .insert([
            {
                usuario_id: userId
            }
        ]);

        if(error){
            throw new Error(error.message);
        }
}

async function createVentureProfile(userId){
    const { error } = await supabase
        .from("perfil_emprendedor")
        .insert([
            {
                usuario_id: userId
            }
        ]);

        if(error){
            throw new Error(error.message);
        }
}

async function createInstituteProfile(userId){
    const { error } = await supabase
        .from("perfil_institucion")
        .insert([
            {
                usuario_id: userId
            }
        ]);

        if(error){
            throw new Error(error.message);
        }
}

async function createEnterpriseProfile(userId){
    const { error } = await supabase
        .from("perfil_empresa")
        .insert([
            {
                usuario_id: userId
            }
        ]);

        if(error){
            throw new Error(error.message);
        }
}

async function update(userId, payload) {

    const { usuario, perfil } = payload;

    if (!perfil) {
        throw new Error("Perfil requerido");
    }

    try {
        if (usuario) {
        const { error: userError } = await supabase
            .from("users")
            .update({
            nombres: usuario.nombres,
            apellido_paterno: usuario.apellido_paterno,
            apellido_materno: usuario.apellido_materno,
            email: usuario.email,
            telefono: usuario.telefono,
            })
            .eq("id", userId);

        if (userError) throw new Error(userError.message);
        }

        const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select(`
            rol,
            perfil_consultor(id),
            perfil_estudiante(id),
            perfil_emprendedor(id),
            perfil_empresa(id),
            perfil_institucion(id),
            perfil_administrador(id)
        `)
        .eq("id", userId)
        .maybeSingle();

        if (fetchError || !userData) {
            throw new Error("No se pudo obtener el perfil del usuario");
        }

        const rol = userData.rol;

        switch (rol) {

            case "consultor": {
                const perfilId = userData.perfil_consultor?.id;

                if (!perfilId) {
                    throw new Error("Perfil consultor no encontrado");
                }

                const { servicios = [], serviciosIds, ...perfilData } = perfil;

                const { error: perfilError } = await supabase
                    .from("perfil_consultor")
                    .update({
                        empresa: perfilData.empresa ?? null,
                        puesto: perfilData.puesto ?? null,
                        disponibilidad: perfilData.disponibilidad ?? "Disponible",
                    })
                    .eq("id", perfilId);

                if (perfilError) throw new Error(perfilError.message);

                if (Array.isArray(servicios)) {

                    const { error: deleteError } = await supabase
                        .from("consultant_services")
                        .delete()
                        .eq("consultor_id", perfilId);

                    if (deleteError) throw new Error(deleteError.message);

                    if (servicios.length > 0) {
                            const inserts = servicios.map((id) => ({
                            consultor_id: perfilId,
                            servicio_id: Number(id),
                        }));

                        const { error: insertError } = await supabase
                            .from("consultant_services")
                            .insert(inserts);

                        if (insertError) throw new Error(insertError.message);
                    }
                }

                break;
            }

            case "estudiante": {
                const perfilId = userData.perfil_estudiante?.id;

                await supabase
                .from("perfil_estudiante")
                .update({
                    universidad: perfil.universidad,
                    division: perfil.division,
                    programa: perfil.programa,
                })
                .eq("id", perfilId);

                break;
            }

            case "emprendedor": {
                const perfilId = userData.perfil_emprendedor?.id;

                await supabase
                .from("perfil_emprendedor")
                .update({
                    sector: perfil.sector ?? null,
                    descripcion: perfil.descripcion ?? null,
                })
                .eq("id", perfilId);

                break;
            }

            case "empresa": {
                const perfilId = userData.perfil_empresa?.id;

                await supabase
                .from("perfil_empresa")
                .update({
                    nombre_empresa: perfil.nombre_empresa,
                    pais: perfil.pais,
                    ciudad: perfil.ciudad,
                    sector: perfil.sector,
                })
                .eq("id", perfilId);

                break;
            }

            case "institucion": {
                const perfilId = userData.perfil_institucion?.id;

                await supabase
                .from("perfil_institucion")
                .update({
                    nombre_institucion: perfil.nombre_institucion,
                    pais: perfil.pais,
                    ciudad: perfil.ciudad,
                })
                .eq("id", perfilId);

                break;
            }

            case "administrador": {
                const perfilId = userData.perfil_administrador?.id;

                await supabase
                .from("perfil_administrador")
                .update({
                    cargo: perfil.cargo,
                    area: perfil.area,
                })
                .eq("id", perfilId);

                break;
            }

            default:
                throw new Error("Rol no soportado");
        }

        return {
            success: true,
            message: "Información actualizada correctamente",
        };

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    register,
    update
}