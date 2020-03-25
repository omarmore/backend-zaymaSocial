'use strict'
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var messageSchema = new Schema({
     
    text:{ type: String, required: [true, 'El campo mensaje es requerido']},
    created_at :{type: String},
    emitter: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
     
});


module.exports = mongoose.model('Follow', messageSchema);