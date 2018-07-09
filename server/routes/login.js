const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({
        email: body.email
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

        if (!item) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'Usuario/password incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, item.password)) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'Usuario/password incorrectos'
                }
            });
        }

        let token = jwt.sign({
                usuario: item
            },
            process.env.TOKEN_SEED, {
                expiresIn: process.env.TOKEN_CADUCIDAD
            });

        res.json({
            OK: true,
            usuario: item,
            token
        })

    });

});

/*Google*/
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/googleLogin', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                OK: false,
                err: {
                    message: e
                }
            })
        })

    Usuario.findOne({
        email: googleUser.email
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

        if (item) {
            if (item.google === false) {
                return res.status(400).json({
                    OK: false,
                    err: {
                        message: 'Debe usar auth normal'
                    }
                });
            } else {
                let token = jwt.sign({
                        usuario: item
                    },
                    process.env.TOKEN_SEED, {
                        expiresIn: process.env.TOKEN_CADUCIDAD
                    });

                return res.json({
                    OK: true,
                    usuario: item,
                    token
                })
            }
        } else {
            // Si el usuario no existe
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'xD';

            usuario.save(err, itemDb => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        err
                    });
                }

                let token = jwt.sign({
                        usuario: itemDb
                    },
                    process.env.TOKEN_SEED, {
                        expiresIn: process.env.TOKEN_CADUCIDAD
                    });

                return res.json({
                    OK: true,
                    usuario: itemDb,
                    token
                })

            })
        }


    });
});

module.exports = app;