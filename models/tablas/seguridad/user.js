module.exports = mongoose => {
    var rolesValidos = {
        values: ['ADMIN_ROLE', 'USER_ROLE'],
        message: '{VALUE} No es un rol permitido'
    };

    var usuarioSchema = mongoose.Schema({
        nombre: { type: String, required: [true, 'El nombre es necesario'] },
        nick: { type: String, unique: [true, 'El nick debe ser único'], required: [true, 'El nick es necesario'] },
        identificacion: { type: String, unique: [true, 'La identificación debe ser única'], required: [true, 'La identicíon es necesaria'] },
        email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
        password: { type: String, required: [true, 'La contraseña es necesaria'] },
        role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
        img: { type: String },
        departamento: { type: mongoose.Schema.Types.ObjectId, ref: 'departamentos', required: true }
    });

    const Usuario = mongoose.model("usuarios", usuarioSchema);
    return Usuario;
};