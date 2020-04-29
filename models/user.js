'use strict'
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol permitido'
};

var usuarioSchema = new Schema({
    //agregar campo de cambiar contraseña

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nick: { type: String },
    identificacion: { type: String, unique: true, required: [true, 'La identicíon es necesaria'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    img: { type: String },
    dependencia: { type: String, required: [true, 'la dependencia es necesario'] },
    //google: { type: Boolean, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);