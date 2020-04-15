'use strict'
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var FollowSchema = new Schema({
     
    user: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    followed: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    
});


module.exports = mongoose.model('Follow', FollowSchema);