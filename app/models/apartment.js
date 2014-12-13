// ApartmentModel
// ==============
// Este modelo é o encargado de relacionar os usuarios cós seus respectivos
// datos na base de datos e tamén de xestionar as suas relacións.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    _ = require('lodash'),
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
        'minimum_stay': Number,
        'comment': String,
        'on_demand': Boolean,
        'minimum': Number,
        'maximum': Number,
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
    'user': {'type': Schema.Types.ObjectId, ref: 'User'},
    'country': {'type': Schema.Types.ObjectId, ref: 'Country'},
    'town': {'type': Schema.Types.ObjectId, ref: 'Town'},
    'province': {'type': Schema.Types.ObjectId, ref: 'Province'},
    'spot': {type: Schema.Types.ObjectId, ref: 'Spot'},
    'services': [{type: Schema.Types.ObjectId, ref: 'Service'}]
});

// ##Callbacks
// ###Antes de gardar
ApartmentSchema.pre('save', function(next) {
    DBUtils.get_valid_url.apply(this, ['Apartment', 'url', 'name', function() {
        next();
    }]);
});

// ##Virtuals
// ###Precio más bajo para hoy
ApartmentSchema.virtual('lowest_price_for_today').get(function() {
    var lowest_price = 0;
    _.each(this.apartments, function(apartment) {
        _.each(apartment.seasons, function(season) {
            lowest_price = lowest_price == 0 || season.price < lowest_price ? season.price : lowest_price;
        });
    });
    return lowest_price;
});

// Exportamos o modelo
module.exports = mongoose.model('Apartment', ApartmentSchema);
