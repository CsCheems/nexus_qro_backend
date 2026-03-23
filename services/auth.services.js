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
            erros.status = 500;
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

module.exports = {
    register,
    login
};