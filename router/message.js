'use strict'

var express = require('express');
var MessageController = require('../controller/message');
var api = express.Router();
var md_auth = require('../middleware/authenticated');

api.get('/probando-md',md_auth.ensureAuth, MessageController.probando);
api.post('/message',md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:id?',md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:id?',md_auth.ensureAuth, MessageController.getEmmitMessages);
api.get('/message-estado',md_auth.ensureAuth, MessageController.getMessageEstado);
api.get('/set-viewed-messages',md_auth.ensureAuth, MessageController.setUnviewedMessages);



module.exports = api;   