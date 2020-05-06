module.exports = app => {
    const UserController = require("../controller/seguridad/user.controller");
    var router = require('express').Router();
    var md_auth = require('../middleware/authenticated');
    var multipart = require('connect-multiparty');
    var md_upload = multipart({ uploadDir: './upload/users' });


    router.post('/', UserController.create);
    router.get('/:id', md_auth.ensureAuth, UserController.findOne);
    router.get('/', md_auth.ensureAuth, UserController.findAll);
    router.put('/:id', UserController.update);

    router.post('/login', UserController.loginUser);
    router.post('/update-imgen-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
    router.get('/get-image-user/:imageFile', UserController.getImageFile);


    // router.get('/home', UserController.home);
    // router.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
    // router.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
    // console.log(md_auth);

    app.use("/api/users", router);
};