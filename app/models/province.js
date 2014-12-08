// ProvinceModel
// =============
// Este modelo é o encargado de relacionar as provincias
// cós seus respectivos datos na base de datos.
'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// ##Esquema de datos do modelo
var ProvinceSchema = new Schema({
    key: {type: String, required: true},
    name: {type: String, required: true},

    // Relacións
    country: {type: Schema.Types.ObjectId, ref: 'Country'}
});

// Exportamos o modelo
module.exports = mongoose.model('Province', ProvinceSchema);