require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.DB_URL, (err, res) => {

    if (err) throw err;

    console.log('db ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${ process.env.PORT }`);
})