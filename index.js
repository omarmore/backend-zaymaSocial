'use strict'

//var express = require('express');
var mongoose = require('mongoose')

;
var app = require('./app');
var port = 3000;
//var bodyParser = require('body-parser');
const db = "mongodb+srv://zaymaApp:zayma123@cluster0-0ecxw.azure.mongodb.net/test?retryWrites=true&w=majority"
    //"mongodb+srv://zaymaApp:zayma123@cluster0-0ecxw.azure.mongodb.net/test?retryWrites=true&w=majority" 190.14.252.180/32



//conexion a la base de datos de mongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, err => {
    if (err) {
        console.error('Error! ' + err);
    } else {
        console.log('Connected to mongodb <3')
    }
});

mongoose.set('debug', true);

// Escuchar peticiones
app.listen(port, () => {
    console.log('Express server en puerto ' + port + ': \x1b[32m%s\x1b[0m', 'online');
});