'use strict'
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var FollowSchema = new Schema({
     
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioFollow: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    
});


module.exports = mongoose.model('Follow', FollowSchema);