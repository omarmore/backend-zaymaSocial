module.exports = mongoose => {

    var PublicacionSchema = mongoose.Schema({

        text: { type: String, required: [true, 'El detalle de la publicacion es necesario'] },
        publico: { type: Boolean, default: false }, //Estado que determina si una publicación aparece como publica
        publicar: { type: Boolean, default: false }, //Estado que determina si el usuario quiere que su publicacón aparezca como publica
        rechazado: { type: Boolean, default: false }, //Estado que determina si el administrador rechaza una publicación (para que no le aparezca mas)
        anulado: { type: Boolean, default: false }, //Estado que determina si el usuario quire quitar su publicación
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }

    }, { timestamps: true });

    const publicaciones = mongoose.model('publicacion', PublicacionSchema);
    return publicaciones;
};