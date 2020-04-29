const dbConfig = require("../config/config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.db;

db.departamentos = require("./tablas/comunes/departamento")(mongoose);
db.usuarios = require("./tablas/seguridad/user")(mongoose);
db.followers = require("./tablas/principal/follow")(mongoose);
db.publicaciones = require("./tablas/principal/publicacion")(mongoose);
db.messages = require("./tablas/principal/message")(mongoose);
module.exports = db;