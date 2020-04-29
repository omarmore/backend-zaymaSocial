module.exports = app => {

    var router = require('express').Router();
    var MessageController = require('../controller/principal/message.controller');

    var md_auth = require('../middleware/authenticated');

    router.get('/probando-md', md_auth.ensureAuth, MessageController.probando);
    router.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
    router.get('/my-messages/:id?', md_auth.ensureAuth, MessageController.getReceivedMessages);
    router.get('/messages/:id?', md_auth.ensureAuth, MessageController.getEmmitMessages);
    router.get('/message-estado', md_auth.ensureAuth, MessageController.getMessageEstado);
    router.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setUnviewedMessages);


    app.use('/api', router);
}