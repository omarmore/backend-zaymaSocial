const db = require("../../models");
const Departamento = db.departamentos;

exports.create = (req, res) => {
    if (!req.body.descripcion) {
        res.status(400).send({ message: "La descripción no puede estar vacia!" });
        return;
    }
    const departamento = new Departamento({
        descripcion: req.body.descripcion,
        estado: req.body.estado
    });
    departamento.save(departamento).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ha ocurrido un error mientras se creaba el departamento."
        });
    });
};