'use strict'
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var PublicacionSchema = new Schema({
     
    text:{ type: String, required: [true, 'El detalle de la publicacion es necesario']},
    file:{ type: String},
    created_at :{type: String},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    
});


module.exports = mongoose.model('publicacion', PublicacionSchema);