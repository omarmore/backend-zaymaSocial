module.exports = mongoose => {
    var tiposValidos = { values: ['MULTIPLE', 'UNICA', 'ABIERTA'], message: '{VALUE} no es un tipo valido' };
    var schema = mongoose.schema({
        descripcion: { type: String, required: [true, 'La descripción es obligatoria'] },
        tipo: { type: String, required: [true, 'El tipo es obligatorio'], enum: tiposValidos },
        estado: { type: Boolean, required: true, default: true },
        orden:{type:Number},
        encabezado: { type: mongoose.Schema.Types.ObjectId, ref: 'encabezados', required: true }
    }, 
    { 
        timestamps: true 
    });
    const Preguntas = mongoose.model("preguntas", schema);
    return Preguntas;
};