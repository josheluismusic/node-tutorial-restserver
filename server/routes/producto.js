const express = require('express');
const {
    tokenVerification
} = require('../middleware/authentication');

const app = express();

let Producto = require('../models/producto')

app.get('/productos', tokenVerification, (req, res) => {
    Producto.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, items) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                });
            }

            res.json({
                OK: true,
                productos: items
            });
        })
});

app.get('/productos/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Producto.find({
            _id: id
        })
        .populate('usuario')
        .populate('categoria')
        .exec((err, item) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                });
            }

            if (!item) {
                return res.status(400).json({
                    OK: false,
                    err: {
                        message: `${id} no corresponde a un producto`
                    }
                });
            }

            res.json({
                OK: true,
                producto: item
            });
        })

});

app.get('/productos/search/:term', tokenVerification, (req, res) => {

    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    console.log(regex);
    
    Producto.find({
        nombre: regex
    })
    .populate('usuario')
    .populate('categoria')
    .exec((err, item) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        if (!item) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: `${id} no corresponde a un producto`
                }
            });
        }

        res.json({
            OK: true,
            producto: item
        });
    })

});

app.post('/productos', tokenVerification, (req, res) => {

    let body = req.body;
    console.log(body);

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, item) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        if (!item) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        res.json({
            OK: true,
            producto: item
        });
    });

});

app.put('/productos/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    let body = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria
    };


    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, item) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        if (!item) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        res.json({
            OK: true,
            producto: item
        });
    });
});

app.delete('/productos/:id', tokenVerification, (req, res) => {

    let id = req.params.id;
    console.log(id);

    Producto.findByIdAndUpdate(id, {
        disponible: false
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
            Producto: item
        });
    });
});


module.exports = app;