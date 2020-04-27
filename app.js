'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var md_auth = require('./middleware/authenticated');

//Iniciarlizar las variables a utilizar
var app = express();
var user_ruotes = require('./router/user');
var follow_routes = require('./router/follow');
var publication_routes = require('./router/publication');
var message_router = require('./router/message');
//Cargar las rutas

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors
// Configurar cabeceras y cors para habilitar las peticiones necesarias
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Rutas
app.use('/api',user_ruotes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);
app.use('/api',message_router);

//app.use();


//Exportar el modulo
module.exports = app;