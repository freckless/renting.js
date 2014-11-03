// #Role Model

// Modelo donde se gardan os roles para os usuarios

'use strict';

// ##Dependencias do módulo
var config = require(global.root_path + '/libs/config.js'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBUtils = require(config.paths.utils + '/database.js');

// ##Esquema de datos do modelo
var RoleSchema = new Schema({
    key: { type: String, required: true },
    name: { type: String, required: true }
});

// ##Validacións
// Configuramos as validacións adicionais necesarias

// ###A chave debe ser única
RoleSchema.path('key').validate(function(val, callback) {
    DBUtils.validate_uniqueness('Role', 'key', val, callback);
}, 'Key should be unique');

// Exportamos o modelo
module.exports = mongoose.model('Role', RoleSchema);