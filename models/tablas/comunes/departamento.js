module.exports = mongoose => {
    var schema = mongoose.Schema({
        descripcion: { type: String, unique: [true, 'No pueden haber dos departamentos con el mismo nombre'], required: [true, 'Este campo es obligatorio'] },
        estado: Boolean
    }, { timestamps: true });

    const Departamento = mongoose.model("departamentos", schema);

    return Departamento;
};