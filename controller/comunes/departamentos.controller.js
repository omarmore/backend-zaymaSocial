const db = require("../../models");
const Departamento = db.departamentos;

exports.create = (req, res) => {
    const departamento = Departamento({
        descripcion: req.body.descripcion,
        estado: req.body.estado
    });

    departamento.save((err, departamentoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error guardando el departamento',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            departamento: departamentoGuardado
        });
    });
};

exports.update = (req, res) => {
    var id = req.params.id;
    var departamento = req.body;

    Departamento.findByIdAndUpdate(id, departamento, { new: true }, (err, departamentoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error guardando el departamento',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            departamento: departamentoGuardado
        });
    });
};

exports.findAll = (req, res) => {
    const limite = parseInt(req.headers['limite']);
    const offset = parseInt(req.headers['offset']);
    const buscar = req.headers['buscar'];

    Departamento.
    find({ descripcion: { $regex: buscar, $options: 'i' } }).
    limit(limite).
    skip(offset).
    exec((err, departamentos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los departamentos',
                errors: err
            });
        }
        Departamento.countDocuments({ descripcion: { $regex: buscar, $options: 'i' } }, (err, total) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error contanto los departamentos',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                departamentos: departamentos,
                total: total
            });

        });
    });
};