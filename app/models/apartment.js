// ApartmentModel
// ==============
// Este modelo é o encargado de relacionar os usuarios cós seus respectivos
// datos na base de datos e tamén de xestionar as suas relacións.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBUtils = require(config.paths.utils + 'database.js');

// ##Esquema de datos do modelo
var ApartmentSchema = new Schema({
    'name': {type: String, required: true},
    'url': String,
    'keys': Number,
    'featured': {type: Boolean, default: false},
    'address': String,
    'geoposition': String,
    'description': DBUtils.localized_field(), // Campo localizable
    'location': DBUtils.localized_field(), // Campo localizable
    'apartments': [{
        'quantity': Number,
        'rooms': Number,
        'minimum': Number,
        'maximum': Number,
        'minimum_stay': Number,
        'comment': String,
        'on_demand': Boolean,
        'seasons': [{
            'price': Number,
            'from': Date,
            'to': Date,
            'on_demand': Boolean,
            'minimum_stay': Number
        }],
        'closed': [{
            'from': Date,
            'to': Date,
            'quantity': Number
        }]
    }],
    'images': [{
        'file': String,
        'description': DBUtils.localized_field() // Campo localizable
    }],
    /* Relacións */
    'country': {'type': Schema.Types.ObjectId, ref: 'Country'},
    'town': {'type': Schema.Types.ObjectId, ref: 'Town'},
    'province': {'type': Schema.Types.ObjectId, ref: 'Province'},
    'spot': {type: Schema.Types.ObjectId, ref: 'Spot'},
    'services': [{type: Schema.Types.ObjectId, ref: 'Service'}]
});

// Exportamos o modelo
module.exports = mongoose.model('Apartment', ApartmentSchema);
