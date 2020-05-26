module.exports = mongoose => {
    var schema = mongoose.schema({
        descripcion: { type: String, required: [true, 'La descripción es obligatoria'] },
        estado: { type: Boolean, required: true, default: true }
    }, { timestamps: true });
    const Encabezados = mongoose.model("encabezados", schema);
    return Encabezados;
};