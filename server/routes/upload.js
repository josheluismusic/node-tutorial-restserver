const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            OK: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            OK: false,
            tipo,
            err: {
                message: `Los tipos permitidos son: ${ tiposValidos.join(', ') }`,
            }
        });
    }

    let archivo = req.files.archivo;
    let filenameArray = archivo.name.split('.');
    let extensionFile = filenameArray[filenameArray.length - 1];
    /*Validacion de extension*/
    let extensionesValiadas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValiadas.indexOf(extensionFile) < 0) {
        return res.status(400).json({
            OK: false,
            extensionFile,
            err: {
                message: `Extensiones validas: ${ extensionesValiadas.join(', ') }`,
            }
        });
    }

    let nombre = `${ id }-${ new Date().getMilliseconds() }.${ extensionFile }`

    archivo.mv(`uploads/${ tipo }/${ nombre }`, (err) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

        switch (tipo) {
            case 'usuarios':
                imgUsuario(id, nombre, res);
                break;
            case 'productos':
                imgProdcuto(id, nombre, res);
                break;
            default:
                return res.status(400).json({
                    OK: false,
                    err: {
                        message: 'Tipo no definido'
                    }
                });
        }

        

    });

});


const imgUsuario = (id, filename, res) => {
    Usuario.findById(id, (err, item) => {

        if (err) {
            
            deleteFile(filename, 'usuarios');
            
            return res.status(400).json({
                OK: false,
                err
            });
        }

        if (!item) {
            
            deleteFile(filename, 'usuarios');
            
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        deleteFile(item.img, 'usuarios');

        item.img = filename;

        item.save((err, saveItem) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                });
            }

            return res.json({
                OK: true,
                usuario: saveItem
            });
        });
    })
}

const imgProdcuto = (id, filename, res) => {
    Producto.findById(id, (err, item) => {

        if (err) {
            
            deleteFile(filename, 'productos');
            
            return res.status(400).json({
                OK: false,
                err
            });
        }

        if (!item) {
            
            deleteFile(filename, 'productos');
            
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        deleteFile(item.img, 'productos');

        item.img = filename;

        item.save((err, saveItem) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                });
            }

            return res.json({
                OK: true,
                producto: saveItem
            });
        });
    })
}

const deleteFile = (img, tipo) => {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ img }`)
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

}

module.exports = app;