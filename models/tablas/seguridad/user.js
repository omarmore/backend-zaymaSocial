module.exports = mongoose => {
    var rolesValidos = {
        values: ['ADMIN_ROLE', 'USER_ROLE'],
        message: '{VALUE} No es un rol permitido'
    };
    mongoose.set('useCreateIndex', true);
    var uniqueValidator = require('mongoose-unique-validator');

    var usuarioSchema = mongoose.Schema({
        //agregar campo de cambiar contraseña

        nombre: { type: String, required: [true, 'El nombre es necesario'] },
        nick: { type: String, unique: true, required: [true, 'El nick es necesario'] },
        identificacion: { type: String, unique: true, required: [true, 'La identicíon es necesaria'] },
        email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
        password: { type: String, required: [true, 'La contraseña es necesaria'] },
        role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
        img: { type: String },
        dependencia: { type: String, required: [true, 'la dependencia es necesario'] },
        //google: { type: Boolean, default: false }
    });
    usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

    const Usuario = mongoose.model("usuarios", usuarioSchema);
    return Usuario;
};