const jwt = require('jsonwebtoken');

// ======================
// Verificar token
// ======================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    //  Verifica el token 
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            })
        }

        //      El token siempre tiene los datos de usuario. 
        //      Se le pasa al request para que sea accesible en los servicios
        req.usuario = decoded.usuario;

        //      Hace que se ejecute el servicio desde el que se llama el middleware 
        next();
    })

}

// ======================
// Verificar token img
// ======================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    //  Verifica el token 
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            })
        }

        //      El token siempre tiene los datos de usuario. 
        //      Se le pasa al request para que sea accesible en los servicios
        req.usuario = decoded.usuario;

        //      Hace que se ejecute el servicio desde el que se llama el middleware 
        next();
    })


}

// ======================
// Verifica ADMIN_ROLE
// ======================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}