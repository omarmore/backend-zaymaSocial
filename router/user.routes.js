module.exports = app => {
    const UserController = require("../controller/seguridad/user.controller");
    var router = require('express').Router();
    var md_auth = require('../middleware/authenticated');
    var multipart = require('connect-multiparty');
    var md_upload = multipart({ uploadDir: './upload/users' });


    router.get('/home', UserController.home);
    router.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
    router.post('/register', UserController.saveUser);
    router.post('/login', UserController.loginUser);
    router.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
    router.get('/users/:page?', UserController.getUsers);
    router.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
    router.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
    router.post('/update-imgen-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
    router.get('/get-image-user/:imageFile', UserController.getImageFile);

    app.use("/api", router);
};