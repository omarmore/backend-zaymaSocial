module.exports = mongoose => {

    var schema = mongoose.schema({
        descripcion: { type: String, required: [true, 'La descripción es obligatoria'] },
        estado: { type: Boolean, required: true, default: true },
        abierta: { type: Boolean, required: true, default: false }, //TODO En caso de que la respuesta sea de selección habilitar permitir input
        pregunta: { type: mongoose.Schema.Types.ObjectId, ref: 'preguntas', required: true }
    }, { timestamps: true });
    const Respuestas = mongoose.model("respuestas", schema);
    return Respuestas;
};