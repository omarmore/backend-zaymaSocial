module.exports = mongoose => {
    uniqueValor = require('mongoose-unique-validator');
    var schema = mongoose.Schema({
        descripcion: { type: String, unique: true, required: [true, 'Este campo es obligatorio'] },
        estado: Boolean
    }, { timestamps: true });


    schema.plugin(uniqueValor, { message: '{PATH} debe ser único' });
    const Departamento = mongoose.model("departamentos", schema);

    return Departamento;
};