// BookingModel
// ============
// Este modelo é o encargado de levar a conta das reservas
// dos apartamentos
'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBUtils = require(config.paths.utils + 'database.js');

// ##Esquema de datos do modelo
var BookingSchema = new Schema({
    from: Date,
    to: Date,
    people: Number,
    confirmed: Boolean,
    days: [{
        day: Date,
        price: Number
    }],
    total: Number,
    paid: Number,
    created_at: Date,
    modified_at: Date,

    // ###Relacións
    'customer': {'type': Schema.Types.ObjectId, ref: 'User'},
    'owner': {'type': Schema.Types.ObjectId, ref: 'User'},
    'apartment_block': {'type': Schema.Types.ObjectId, ref: 'Apartment'},
    'apartment': {'type': Schema.Types.ObjectId} // Esta non é unha relación como tal pero conten a ID da temporada usada
});

// ##Callbacks
// ###Antes de gardar
BookingSchema.pre('save', DBUtils.update_document_dates);

// Exportamos o modelo
module.exports = mongoose.model('Booking', BookingSchema);