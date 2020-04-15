'use strict'

var express = require('express');
var FollowController = require('../controller/publication');
var api = express.Router();
var md_auth = require('../middleware/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir : './upload/users'});

api.get('/probando-pub',md_auth.ensureAuth, FollowController.probando);
api.post('/publication',md_auth.ensureAuth, FollowController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth, FollowController.getPublications);


module.exports = api;