'use strict'
var express = require('express');
var bodyParser = require('body-parser');

// var md_auth = require('./middleware/authenticated');

//Iniciarlizar las variables a utilizar
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
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
require('./router/departamento.routes')(app);
require('./router/user.routes')(app);
require('./router/follow.routes')(app);
require('./router/message.routes')(app);
require('./router/publication.routes')(app);

//app.use();
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a la aplicación" });
});

//Exportar el modulo
module.exports = app;