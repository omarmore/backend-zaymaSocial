module.exports = mongoose => {

    var schema = mongoose.schema({
        descripcion: { type: String, required: true },
        estado: { type: Boolean, required: true, default: true },
        finalizacion: { type: Date }, //Fecha en que la encuesta se cerrara
        encabezado: { type: mongoose.Schema.Types.ObjectId, ref: 'encabezados', required: true },
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true }
    }, { timestamps: true });
    const Encuestas = mongoose.model("encuestas", schema);
    return Encuestas;
};