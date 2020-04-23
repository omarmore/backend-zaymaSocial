'use strict'

var path   = require('path');
var fs     = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');


var Publication = require('../models/publicacion');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req,res){
    res.status(200).send({
        message:"Hola desde el controlador de Publicaciones"
    })
}

function savePublication(req, res){
    var params = req.body;
    
    if(!params.text){
        return res.status(200).send({message:'Debes enviar un texto !!'});
    }

    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null'; 
    publication.usuario = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err,publicationStored) =>{
        if(err) return res.status(500).send({message : 'Error al guardar la publicación'});
        
        if(!publicationStored) return res.status(404).send({message : 'La publicaión No ha sido guardada'});
        
        return res.status(200).send({publication:publicationStored});
    })
}

 function getPublications(req,res){

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;
        var follows_clean = [];
    Follow.find({user: req.user.sub}).populate('followed').exec().then((follows)=>{
        for(let i in follows){
            follows_clean.push(follows[i].followed._id);
        }
        console.log(follows_clean);

         Publication.find({usuario:{$in:follows_clean}}).sort('created_at').populate('user').paginate(page,itemsPerPage,(err,publicacions,total)=>{
            if(err) return res.status(500).sent({message:'Error devolver publicaciones '+err});
            if(!publicacions) return res.status(404).send({message : 'No hay publicaciones'});
            return res.status(200).send({
                total_items : total,
                pages : Math.ceil(total/itemsPerPage),
                page : page,
                publicacions
            })

        });


    //consulta detalle para identificar el error 
        /*Publication.find({usuario:{$in:follows_clean}}).populate('user').exec((err,publicacions) =>{
            
            if(err) return res.status(500).send({massage : 'Error en el servidor'});
            if(!publicacions) return res.status(404).send({massage : 'No sigues a ningun usuario'});
                console.log(publicacions);
            return res.status(200).send({publicacions});  
             
        });*/
    
        
    });
 }

function getPublication(req,res){
    var publicationId = req.params.id;

    Publication.findById(publicationId,(err,publication)=>{
        if(err) return res.status(500).send({message : 'Error al devolver publicaciones '});
        if(!publication) return res.status(404).send({message :'No existe la publicación '});
        return res.status(200).send({publication});
    });

}

function deletePublication(req, res){
    var publicationId = req.params.id;
    Publication.deleteOne({'usuario':req.user.sub,'_id':publicationId}, (err, publiactionRemoved) =>{
        if(err) return res.status(500).send({message : 'Error al eliminar la publicación'});
        if(!publiactionRemoved) return res.status(404).send({message : 'No se ha eliminado la publicación'});
        return res.status(200).send({message : 'Publicación eliminar correctamente '});
    });

    //la funcion remove enta pronto a ser deprecada por tal motivo se utiliza el metodo deleteOne
    /*Publication.find({'usuario':req.user.sub,'_id':publicationId}).remove( (err, publiactionRemoved) =>{
        if(err) return res.status(500).send({message : 'Error al eliminar la publicación'});
        if(!publiactionRemoved) return res.status(404).send({message : 'No se ha eliminado la publicación'});
        return res.status(200).send({message : 'Publicación eliminar correctamente '});
    });*/
}


//Subir archivo para las plublicaciones  de usuario
function uploadImage(req,res){
    var publicationId = req.params.id;

  
    if(req.files){

        //Manejo del archivo cargado para conocer nombre y extención del archivo immmg
        var file_path = req.files.file.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(file_split);

        var file_ext = ext_split[1];
        console.log(file_ext);



        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //Actualizar img de la publication

            Publication.find({'usuario':req.user.sub, '_id': publicationId}).exec((err, publication) =>{
                if(publication){
                    Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true},(err,publicationUpdated)=>{
                        if(err) return res.status(500).send({message: 'Error en la petición'});
                
                        if(!publicationUpdated) return res.status(404).send({message : 'No se ha podido actualizar el usuario '});
                
                        return res.status(200).send({publication:publicationUpdated});
                    });
                }else{
                    return removeFileUploads(res,file_path,'No tiene permisos para actualizar la imagen');
                }
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
    var path_file = './upload/publications/' + image_file;

    fs.exists(path_file,(exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'});
        }
    });


}


module.exports = {

    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile

}