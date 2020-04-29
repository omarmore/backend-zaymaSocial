'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var db = require('../../models');

var User = db.usuarios;

var Follow = db.followers;
var Message = db.messages;


function probando(req, res) {
    res.status(200).send({ message: 'Hola que tal, desde los mensajes privados' });
}


function saveMessage(req, res) {
    var params = req.body;
    if (!params.text || !params.receiver) return res.status(404).send({ message: 'Envia los datos necesarios' });

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' + err });
        if (!messageStored) return res.status(404).send({ message: 'Error al enviar el mensaje' });

        return res.status(200).send({ message: messageStored });
    });
}

function getReceivedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({ receiver: userId }).populate('emitter', 'nombre nick img email surname _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!messages) return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        })


    });

}

function getEmmitMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({ emitter: userId }).populate('emitter receiver', 'nombre nick img email surname _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!messages) return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        })


    });

}

//Funcion que permite contar los mensajer que encuentran sin leer 
function getMessageEstado(req, res) {
    var userId = req.user.sub;

    Message.countDocuments({ receiver: userId, viewed: 'false' }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        return res.status(200).send({
            'sinleer': count
        });
    })
}

//Actuializar el estado de los mensajes para marcar como leidos
function setUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.updateMany({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { "multi": true }, (err, messageUpdate) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        return res.status(200).send({
            message: messageUpdate
        });
    });
}


module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getMessageEstado,
    setUnviewedMessages

}