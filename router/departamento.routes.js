module.exports = app => {
    const tutorials = require("../controller/comunes/departamentos.controller.js");
    var router = require("express").Router();

    router.post("/", tutorials.create);

    app.use("/api/departamentos", router);
};