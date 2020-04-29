module.exports = mongoose => {
    mongoose.set('useCreateIndex', true);
    var messageSchema = mongoose.Schema({

        text: { type: String, required: [true, 'El campo mensaje es requerido'] },
        viewed: { type: String },
        created_at: { type: String },
        emitter: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    });

    const message = mongoose.model('Message', messageSchema);
    return message;
};