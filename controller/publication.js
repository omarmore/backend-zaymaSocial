'use strict'

var path   = require('path');
var fs     = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

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

    /*Publication.find({'usuario':req.user.sub,'_id':publicationId}).remove( (err, publiactionRemoved) =>{
        if(err) return res.status(500).send({message : 'Error al eliminar la publicación'});
        if(!publiactionRemoved) return res.status(404).send({message : 'No se ha eliminado la publicación'});
        return res.status(200).send({message : 'Publicación eliminar correctamente '});
    });*/
}

module.exports = {

    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication

}