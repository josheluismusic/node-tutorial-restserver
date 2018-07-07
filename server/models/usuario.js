const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

let validRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String, 
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String, 
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRole
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(mongooseUniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports =  mongoose.model('usuario', usuarioSchema);