'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//Iniciarlizar las variables a utilizar
var app = express();
var user_ruotes = require('./router/user');

//Cargar las rutas

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors

//Rutas
app.use('/api',user_ruotes);



//Exportar el modulo
module.exports = app;