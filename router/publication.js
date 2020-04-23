'use strict'

var express = require('express');
var PublicationController = require('../controller/publication');
var api = express.Router();
var md_auth = require('../middleware/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir : './upload/users'});

api.get('/probando-pub',md_auth.ensureAuth, PublicationController.probando);
api.post('/publication',md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id',md_auth.ensureAuth, PublicationController.getPublication  );
api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);

module.exports = api;