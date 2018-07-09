const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');

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

})

module.exports = app;