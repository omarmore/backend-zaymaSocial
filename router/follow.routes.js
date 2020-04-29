module.exports = app => {

    var router = require('express').Router();
    var FollowController = require('../controller/principal/follow.controller');
    var md_auth = require('../middleware/authenticated');

    router.get('/prueba', md_auth.ensureAuth, FollowController.prueba);
    router.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
    router.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
    router.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
    router.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
    router.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);

    app.use('/api', router);
};