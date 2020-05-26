var db = require('../../models');
var Publication = db.publicaciones;

exports.create = (req, res) => {
    var params = req.body;

    if (!params.text) {
        return res.status(200).send({ message: 'Debes enviar un texto !!' });
    }

    var publication = new Publication();
    publication.text = params.text;
    publication.usuario = req.user.sub;

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar la publicación' });

        if (!publicationStored) return res.status(404).send({ message: 'La publicaión No ha sido guardada' });
        return res.status(200).send({ publication: publicationStored });
    });
};

exports.findAllPublicas = (req, res) => {
    const limite = parseInt(req.headers['limite']);
    const offset = parseInt(req.headers['offset']);
    const buscar = req.headers['buscar'];

    Publication.
    find({ text: { $regex: buscar, $options: 'i' } }).
    where('publico').equals(false). //TODO cambiar a true
    where('publicar').equals(false). // TODO cambiar a true
    where('rechazado').equals(false).
    where('anulado').equals(false).
    limit(limite).
    skip(offset).
    sort('-createdAt').
    exec((err, publicaciones) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando las publicaciones',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            publicaciones: publicaciones
        });
    });
};

exports.findAllPorPublicar = (req, res) => {
    const limite = parseInt(req.headers['limite']);
    const offset = parseInt(req.headers['offset']);
    const buscar = req.headers['buscar'];

    Publication.
    find({ text: { $regex: buscar, $options: 'i' } }).
    where('publico').equals(false).
    where('publicar').equals(false). // TODO cambiar a true
    where('rechazado').equals(false).
    where('anulado').equals(false).
    limit(limite).
    skip(offset).
    sort('-createdAt').
    exec((err, publicaciones) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando las publicaciones',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            publicaciones: publicaciones
        });
    });
};

exports.findAllUsuario = (req, res) => {
    const limite = parseInt(req.headers['limite']);
    const offset = parseInt(req.headers['offset']);
    const buscar = req.headers['buscar'];
    idUsuario = req.user.sub;

    Publication.
    find({ text: { $regex: buscar, $options: 'i' } }).
    where('publico').equals(false).
    where('publicar').equals(false).
    where('anulado').equals(false).
    where('usuario').equals(idUsuario).
    limit(limite).
    skip(offset).
    sort('-createdAt').
    exec((err, publicaciones) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando las publicaciones',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            publicaciones: publicaciones
        });
    });
};


// TODO En el frontEnd dependiendo de lo que mande en el body se pueden actualizar los solamente los estados
// Entonces hay que crear un servicio en el frontEnd para solo mandar en el body el estado y otro servicio para modificar solo el texto

exports.update = (req, res) => {
    idPublicacion = req.params.id;

    Publication.findByIdAndUpdate(idPublicacion, req.body, { new: true }, (err, publicacionActualizada) => {
        if (err) {
            return res.status(500).send({
                message: 'Error en la petición'
            });
        }
        res.status(200).send(publicacionActualizada);
    });
};

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Error al devolver publicaciones ' });
        if (!publication) return res.status(404).send({ message: 'No existe la publicación ' });
        return res.status(200).send({ publication });
    });

}

// function deletePublication(req, res) {
//     var publicationId = req.params.id;
//     Publication.deleteOne({ 'usuario': req.user.sub, '_id': publicationId }, (err, publiactionRemoved) => {
//         if (err) return res.status(500).send({ message: 'Error al eliminar la publicación' });
//         if (!publiactionRemoved) return res.status(404).send({ message: 'No se ha eliminado la publicación' });
//         return res.status(200).send({ message: 'Publicación eliminar correctamente ' });
//     });

//     //la funcion remove enta pronto a ser deprecada por tal motivo se utiliza el metodo deleteOne
//     /*Publication.find({'usuario':req.user.sub,'_id':publicationId}).remove( (err, publiactionRemoved) =>{
//         if(err) return res.status(500).send({message : 'Error al eliminar la publicación'});
//         if(!publiactionRemoved) return res.status(404).send({message : 'No se ha eliminado la publicación'});
//         return res.status(200).send({message : 'Publicación eliminar correctamente '});
//     });*/
// }


// module.exports = {

//     probando,
//     savePublication,
//     getPublications,
//     getPublication,
//     deletePublication,
//     uploadImage,
//     getImageFile

// }