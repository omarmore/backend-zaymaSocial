const dbConfig = require("../config/config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.db;
db.departamentos = require("./tablas/comunes/departamento")(mongoose);

module.exports = db;