const express = require('express');
const fs = require('fs');
const path = require('path');
const {
    tokenGetVerification
} = require('../middleware/authentication')

const app = express();



app.get('/images/:tipo/:img', tokenGetVerification, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let imgPath = path.resolve(__dirname, `../../uploads/${tipo}/${ img }`);

    if (!fs.existsSync(imgPath)) {
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    }

    res.sendFile(path.resolve(__dirname, `../../uploads/${tipo}/${ img }`));

    

});

module.exports = app;