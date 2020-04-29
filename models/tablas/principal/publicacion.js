module.exports = mongoose => {
    mongoose.set('useCreateIndex', true);

    var PublicacionSchema = mongoose.Schema({

        text: { type: String, required: [true, 'El detalle de la publicacion es necesario'] },
        file: { type: String },
        created_at: { type: String },
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },

    });

    const publicaciones = mongoose.model('publicacion', PublicacionSchema);
    return publicaciones;
};