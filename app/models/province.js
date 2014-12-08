// ProvinceModel
// =============
// Este modelo é o encargado de relacionar as provincias
// cós seus respectivos datos na base de datos.
'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBUtils = require(config.paths.utils + 'database.js');

// ##Esquema de datos do modelo
var ProvinceSchema = new Schema({
    key: {type: String, required: true},
    name: DBUtils.localized_field(), // Campo localizable

    // Relacións
    country: {type: Schema.Types.ObjectId, ref: 'Country'}
});

// Exportamos o modelo
module.exports = mongoose.model('Province', ProvinceSchema);