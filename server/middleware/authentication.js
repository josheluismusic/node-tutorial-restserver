const jws = require('jsonwebtoken');

let tokenVerification = (req, res, next) => {
    let token = req.get('Authorization');

    jws.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                OK: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next();

    });
}
let adminRoleVerification = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            OK: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

}

let tokenGetVerification = (req, res, next) => {
    let token = req.query.token;

    jws.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                OK: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next();

    });
}

module.exports = {
    tokenVerification, 
    adminRoleVerification,
    tokenGetVerification
}