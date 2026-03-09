const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const generateToken = require("../utils/jwt");

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

        if(!name || !lastName || !email || !password || !role){
            throw new Error("Faltan campos obligatorios");
        }

        const normalizedEmail = email.toLowerCase();

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const {data, error} = await supabase
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
            .single()
        
        if(error){
            console.log(error);
            throw new Error(error.message);
        }

        const token = generateToken(data);

        delete data.password;

        return{
            user: data,
            token
        }

    }catch(e){
        throw new Error(e.message);
    }
}

module.exports = {
    register
};