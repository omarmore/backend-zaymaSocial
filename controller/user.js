'use strict'

var bcrypt = require('bcryptjs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');


var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publicacion');
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
        
        followThisUser(req.user.sub , userId).then((value) =>{
             user.password = ':)';
             return   res.status(200).send({
                user, 
                following : value.following,
                followed  : value.followed
            });
            
        });
    });

}



//function async para consultar los usuaris que sigo y los que me siguen
async function followThisUser(identity_user_id, user_id){
    var following = await Follow.findOne({"user" : identity_user_id, "followed":user_id}).exec().then((follow)=>{
        return follow;
    }).catch((err) =>{
        return handleError
    });
    
    var followed = await Follow.findOne({"user": user_id , "followed":identity_user_id}).exec().then((follow)=>{
        return follow;
    }).catch((err) =>{
        return handleError
    });
    
    return {
        following : following,
        followed  : followed
    }
}

//funciton de informacion que cuando nos siguen
const getCounters = (req,res)=>{
    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }

    getCountFollow(userId).then((value)=>{
        return res.status(200).send(value);
    });
}


const  getCountFollow = async (user_id) => {
    try {
        let following = await Follow.countDocuments({"user":user_id},(err,result) => {return result});
        let followed = await Follow.countDocuments({"followed":user_id},(err,result) => {return result});
        let publication  = await Publication.countDocuments({"usuario":user_id},(err,result) => {return result});
        

        return {
            following,
            followed,
            publication
        }
    } catch (e) {
        console.log(e);
    }

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
        
        followsUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                users_following : value.following,
                user_follow_me  : value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            }); 
        });

    });
}


async function followsUserIds(user_id){
    try {
        var following = await Follow.find({"user":user_id}).select({'_id':0,'__v':0,'user':0}).exec()
        .then((follows) => {return follows;}).catch((err)=>{return handleError(err)});


        var followed = await Follow.find({"followed":user_id}).select({'_id':0,'__v':0,'followed':0}).exec()
        .then((follows) => {return follows;}).catch((err)=>{return handleError(err)});

        //Procesar following Ids

        var following_clean= [];
        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });

        //Procesar followed Ids 

        var followed_clean =[];
        followed.forEach((follow)=>{
            followed_clean.push(follow.user);
        });

        return {
            following : following_clean,
            followed  : followed_clean
        }
    } catch (e) {
        console.log(e);
    }

    

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
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}