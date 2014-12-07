// #User Model

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
    'description': [{
        'locale': String,
        'value': String
    }],
    'location': [{
        'locale': String,
        'value': String
    }],
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
            'start_at': Date,
            'end_at': Date,
            'quantity': Number,
            'on_demand': Boolean,
            'minimum_stay': Number,
            'use_as_default': Boolean
        }],
        'closed': [{
            'start_at': Date,
            'end_at': Date,
            'quantity': Number
        }]
    }],
    'images': [{
        'file': String,
        'description': [{
            'locale': String,
            'value': String
        }]
    }]
});

// Exportamos o modelo
module.exports = mongoose.model('Apartment', ApartmentSchema);