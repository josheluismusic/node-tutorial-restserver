const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
    
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img' )
            .skip(from)
            .limit(limit)
            .exec((err, usuarios)=> {
                if (err) {
                    return res.status(400).json({
                        OK: false,
                        err
                    });
                }

                Usuario.count({ estado: true }, (err, count) => {
                    res.json({
                        OK: true,
                        count,
                        usuarios
                    });
                });

                
            })
})

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, item) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        res.json({
            OK: true,
            usuario: item
        });
    });
})

app.put('/usuario/:id', function (req, res) {
   
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, item) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }
        res.json({
            OK: true,
            usuario: item
        });
    });

})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, item) => {
    //     if (err) {
    //         return res.status(400).json({
    //             OK: false,
    //             err
    //         });
    //     }

    //     if (item === null){
    //         return res.status(400).json({
    //             OK: false,
    //             err: {
    //                 message: 'USUARIO no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         OK: true,
    //         usuario: item
    //     });
    // });

    Usuario.findByIdAndUpdate(id, {
        estado: false
    }, {
        new: true
    }, (err, item) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }
        res.json({
            OK: true,
            usuario: item
        });
    });
})

module.exports = app;