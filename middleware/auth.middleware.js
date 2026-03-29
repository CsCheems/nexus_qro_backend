
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

      // console.log("TOKEN:", token);
      // console.log("SECRET:", process.env.JWT_SECRET);

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