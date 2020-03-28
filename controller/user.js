'use strict'

var bcrypt = require('bcryptjs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

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
function getUser(req, res){
//mesaje de prueba
//actualizate tambien
    var userId = req.params.id;   
    User.findById(userId, (err,user)=>{
        if (err) return res.status(500).send({message:'Error en la petición'});

        if (!user) return res.status(404).send({message:'El usuario no existe'});

        return res.status(200).send({user});
    });

}

//Devolver un listado de usuaris paginados 
function getUsers(req, res ){
    var identity_user_id = req.user.sub;
    var page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('id').paginate(page,itemsPerPage,(err,users,total)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!users) return res.status(404).send({message:'No hay usuarios disponibles'});
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        }); 
    });
}


//Editar datos de usuario   
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    //borrar propiedad password
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({message : 'No tiene permimisos para actualizar los datos de este usuario'});
    }

    
    //User.findByIdAndUpdate(userId,update,{new:true},(err, userUpdated)=>{
    User.findByIdAndUpdate(userId,update,{new:true},(err, userUpdated)=>{

        if(err) return res.status(500).send({message: 'Error en la petición'});
        
        if(!userUpdated) return res.status(404).send({message : 'No se ha podido actualizar el usuario '});

        return res.status(200).send({user:userUpdated});

    });

}


//Subir archivo de imgen/avatar de usuario
function uploadImage(req,res){
    var userId = req.params.id;

    if (userId != req.user.sub) {
        return res.status(500).send({message : 'No tiene permimisos para actualizar los datos de este usuario'});
    }
    if(req.files){

        //Manejo del archivo cargado para conocer nombre y extención del archivo immmg
        var file_path = req.files.img.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(file_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if(userId != req.user.sub){
            return removeFileUploads(res,file_path, 'No tiene permimisos para actualizar los datos del usuario');
        }
        

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //Actualizar img de usuario logeado
            User.findByIdAndUpdate(userId, {img: file_name}, {new:true},(err,userUpdated)=>{
                if(err) return res.status(500).send({message: 'Error en la petición'});
        
                if(!userUpdated) return res.status(404).send({message : 'No se ha podido actualizar el usuario '});
        
                return res.status(200).send({user:userUpdated});
            });
        }else{
            return removeFileUploads(res,file_path,'Extensión no valida');
        }

    }else{
        return res.status(200).send({message : 'No se han subido imagenes'}); 
    }
}


function removeFileUploads(res,file_path,mensaje){
    fs.unlink(file_path,(err)=>{
        return res.status(200).send({message: mensaje});
    });
}


//obtener imagen 
function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './upload/users/' + image_file;

    fs.exists(path_file,(exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'});
        }
    });


}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}