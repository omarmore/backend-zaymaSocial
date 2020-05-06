module.exports = app => {
    var router = require('express').Router();
    var PublicationController = require('../controller/principal/publication.controller');


    var md_auth = require('../middleware/authenticated');

    var multipart = require('connect-multiparty');
    var md_upload = multipart({ uploadDir: './upload/plublications' });

    router.post('/', md_auth.ensureAuth, PublicationController.create);
    router.get('/', PublicationController.findAllPublicas);
    router.get('/publicar', PublicationController.findAllPorPublicar);
    router.get('/usuario', md_auth.ensureAuth, PublicationController.findAllUsuario);
    router.put('/:id', PublicationController.update);
    // router.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
    // router.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
    // router.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
    // router.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);
    // router.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
    // router.get('/get-image-publication/:imageFile', PublicationController.getImageFile);

    app.use('/api/publicaciones', router);
};