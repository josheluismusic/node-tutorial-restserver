const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let castegoriaSchema = new Schema({
    descripcion: {
        type: String, 
        required: [true, 'La descripcion es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'usuarios', 
        required: [true, 'El usuario es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    },
    
});

module.exports =  mongoose.model('categorias', castegoriaSchema);