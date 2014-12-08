// TownModel
// =============
// Este modelo é o encargado de relacionar as cidades
// cós seus respectivos datos na base de datos.
'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// ##Esquema de datos do modelo
var TownSchema = new Schema({
    key: {type: String, required: true},
    name: {type: String, required: true},

    // Relacións
    province: {type: Schema.Types.ObjectId, ref: 'Province'}
});

// Exportamos o modelo
module.exports = mongoose.model('Town', TownSchema);