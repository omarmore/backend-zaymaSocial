'use strict'


var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req,res){
    res.status(200).send({massage : 'Hola mundo desde el controlador follows'});
}

function saveFollow(req,res){

    var params = req.body;

    var follow = new Follow();

    follow.user = req.user.sub;
    
    follow.followed = params.followed;
    console.log(follow.followed);
    follow.save((err,followStored)=>{
        if(err) return res.status(500).send({massage:err + 'Error al guardar el seguimiento'});

        if(!followStored) return res.status().send({massage:'El seguimiento no se ha guardado'});

        return res.status(200).send({follow:followStored});
    });
}

function deleteFollow(req,res){
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user':userId, 'followed' : followId}).deleteMany(err =>{
        if(err) return res.status(500).send({massage : 'Error al dejar de seguir'});
        return res.status(200).send({massage:'El follow se ha eliminado!!'});
    });
}

function getFollowingUsers(req,res){
    var userId = req.user.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var itemsPerPage = 4;
    Follow.find({user:userId}).populate({path :'followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
        if(err) return res.status(500).send({massage :'Error en el servidor '});

        if(!follows) return res.status(404).send({massage : 'No estas siguiendo a ningun usuario '});
        return res.status(200).send({
            total:total,
            pages : Math.ceil(total/itemsPerPage),
            follows
        });
    })
}

function getFollowedUsers(req, res){
    var userId = req.user.sub;
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.id;
    }

    var itemsPerPage = 4;

    Follow.find({followed:userId}).populate('user').paginate(page,itemsPerPage,(err,follows,total)=>{
        if(err) return res.status(500).send({massage:'Error en el servidor'});
        if(!follows) return res.status(404).send({massage : 'No te sigue ningun usuario'});
        return res.status(200).send({
            total :total,
            pages:Math.ceil(total/itemsPerPage),
            follows
        });
    });
}

//Devolver usuarios que sigo y que me siguen
function getMyFollows(req, res){
    var userId = req.user.sub;
    var find = Follow.find({user:userId});

    if (req.params.followed) {
        find = Follow.find({followed :userId});
    }

    find.populate('user followed').exec((err,follows) =>{
         if(err) return res.status(500).send({massage : 'Error en el servidor'});
         if(!follows) return res.status(404).send({massage : 'No sigues a ningun usuario'});
        return res.status(200).send({follows});   
    });

}


module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows

}

