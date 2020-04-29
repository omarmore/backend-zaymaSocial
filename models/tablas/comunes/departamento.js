module.exports = mongoose => {
    var schema = mongoose.Schema({
        descripcion: String,
        estado: Boolean
    }, { timestamps: true });

    const Departamento = mongoose.model("departamentos", schema);
    return Departamento;
};