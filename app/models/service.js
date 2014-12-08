// ServiceModel
// =============
// Este modelo é o encargado de relacionar os spots (lugares)
// cós seus respectivos datos na base de datos.
'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBUtils = require(config.paths.utils + 'database.js');

// ##Esquema de datos do modelo
var ServiceSchema = new Schema({
    key: {type: String, required: true},
    name: DBUtils.localized_field(), // Campo localizable
});

// Exportamos o modelo
module.exports = mongoose.model('Service', ServiceSchema);