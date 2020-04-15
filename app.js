'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var md_auth = require('./middleware/authenticated');

//Iniciarlizar las variables a utilizar
var app = express();
var user_ruotes = require('./router/user');
var follow_routes = require('./router/follow');
var publication_routes = require('./router/publication');
//Cargar las rutas

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors

//Rutas
app.use('/api',user_ruotes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);

//app.use();


//Exportar el modulo
module.exports = app;