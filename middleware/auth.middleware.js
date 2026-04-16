
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

function requireAuth(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          message: "No autenticado",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({
          message: "Usuario no válido",
        });
      }

      delete user.password;

      if(user.rol === "consultor"){
        const { data: userProfile } = await supabase
        .from("perfil_consultor")
        .select("*")
        .eq("usuario_id", user.id)
        .single();

        if (!userProfile) {
          return res.status(401).json({
            message: "Perfil no válido",
          });
        }

        req.userProfile = userProfile;
      }

      if(user.rol === "emprendedor"){
        const { data: userProfile } = await supabase
        .from("perfil_emprendedor")
        .select("*")
        .eq("usuario_id", user.id)
        .single();

        if(!userProfile){
          return res.status(401).json({
            message: "Perfil no valido",
          });
        }

        req.userProfile = userProfile;
      }

      req.user = user;

      if (allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.rol)) {
          return res.status(403).json({
            message: "No tienes permisos para acceder a este recurso",
          });
        }
      }

      next();

    } catch (error) {
      return res.status(401).json({
        message: "Token inválido o expirado",
      });
    }
  };
}

module.exports = {
  requireAuth,
};