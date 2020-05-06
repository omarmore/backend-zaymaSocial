module.exports = app => {
    const departamentos = require("../controller/comunes/departamentos.controller.js");
    var router = require("express").Router();

    router.post("/", departamentos.create);
    router.get("/", departamentos.findAll);
    router.put('/:id', departamentos.update);

    app.use("/api/departamentos", router);
};