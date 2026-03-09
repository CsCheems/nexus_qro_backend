const jwt = require('jsonwebtoken');

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            rol: user.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        }
    );
}

module.exports = generateToken;