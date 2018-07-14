const express = require('express');
const {
    tokenVerification
} = require('../middleware/authentication')

const app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', tokenVerification, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, items) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            });
        }

        res.json({
            OK: true,
            categorias: items
        });
    })
});

app.get('/categoria/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, item) => {
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
                    message: `${id} no corresponde a una categoría`
                }
            });
        }

        res.json({
            OK: true,
            categoria: item
        });
    })

});

app.post('/categoria', tokenVerification, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, item) => {
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
            categoria: item
        });
    });

});

app.put('/categoria/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, {
        descripcion: req.body.descripcion
    }, {
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
            categoria: item
        });
    });
});

app.delete('/categoria/:id', tokenVerification, (req, res) => {

    let id = req.params.id;
    console.log(id);

    Categoria.findByIdAndUpdate(id, {
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
            categoria: item
        });
    });
});

module.exports = app;