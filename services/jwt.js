'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_para_poder_entrar_a_esta_pagina_sin_problemas';


exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        nick: user.nick,
        identificacion: user.identificacion,
        email: user.email,
        role: user.role,
        img: user.img,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix
    };
    return jwt.encode(payload, secret);
}