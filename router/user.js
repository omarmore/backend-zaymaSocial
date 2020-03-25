'use strict'

var express = require('express');
var UserController = require('../controller/user');

var api = express.Router();
var md_auth = require('../middleware/authenticated');

api.get('/home',UserController.home);
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api; 