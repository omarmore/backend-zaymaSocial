'use strict'

var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('../services/jwt');




/**
 * Metodos de Prueba 
 * home -- Pruebas
 */
 
 
function home(req,res){
    res.status(200).send({
        message: 'Ruta Prueba para la ruta "/"'
    });
}

function pruebas(req,res){
    res.status(200).send({
        message: 'Ruta Prueba'
    })
}



//Ruta que permite el registro de nuevos usuarios
function saveUser(req,res){
    var body = req.body;

    var usuario = new User({
        nombre: body.nombre,
        identificacion: body.identificacion,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
 
    });
    usuario.save((err, usuarioGuardado) => { 
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err
            });
        }

        res.status(201).json({ 
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });
}

//Metodo que permite el login de los Usuarios
function loginUser(req,res){
    var params = req.body;

    var identificacion = params.identificacion;
    var password = params.password;

    User.findOne({identificacion:identificacion},(err,user)=>{
        if(err) return res.status(500).send({message:'Error en la pertición'});
        if(user) {
            bcrypt.compare(password , user.password,(err,check)=>{
                if (check) {
                     if (params.gettoken) {
                        //generar y devolver token  
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                        //Generar token

                     } else {
                         //Devolver datos del usuario
                        user.password = ':)';
                        return res.status(200).send({user});
                     }
                
                }else{
                    return res.status(404).send({message:'El usurio no se ha podido identificar'});
                }
            });
        }else{
            return res.status(404).send({message:'El usuario no se ha podido identificar!!'});
        }
    });
}



//Metodo que permite consultar los usuarios 
function getUser(){
//mesaje de prueba
//actualizate tambien
 

}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}