// ApartmentModel
// ==============
// Este modelo é o encargado de relacionar os usuarios cós seus respectivos
// datos na base de datos e tamén de xestionar as suas relacións.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    _ = require('lodash'),
    mongoose = require('mongoose'),
    moment = require('moment'),
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
ApartmentSchema.pre('save', DBUtils.update_document_dates);
ApartmentSchema.pre('save', function(next) {
    DBUtils.get_valid_url.apply(this, ['Apartment', 'url', 'name', function() {
        next();
    }]);
});

// ##Virtuals
// ###Precio más bajo para hoy
ApartmentSchema.virtual('lowest_price_for_today').get(function() {
    var lowest_price = 0;
    var today = new Date();
    _.each(this.apartments, function(apartment) {
        _.each(apartment.seasons, function(season) {
            //if (season.from <= today && season.to >= today && season.price > 0) {
                lowest_price = lowest_price === 0 || season.price < lowest_price ? season.price : lowest_price;
            //}
        });
    });
    return lowest_price;
});

// ###Imaxen principal
ApartmentSchema.virtual('main_image').get(function() {
    var main_image = 'no-image.png';
    if (this.images.length > 0) {
        main_image = this.images[0].file;
    }
    return main_image;
});

// ###Capacidade do apartamento
ApartmentSchema.virtual('capacity').get(function(){
    var minimum = null, maximum = null;
    _.each(this.apartments, function(apartment) {
        if (minimum === null || minimum > apartment.minimum) minimum = apartment.minimum;
        if (maximum === null || maximum < apartment.maximum) maximum = apartment.maximum;
    });
    return { minimum: minimum, maximum: maximum };
});

// ###Número de habitacións
ApartmentSchema.virtual('max_rooms').get(function(){
    var rooms = null;
    _.each(this.apartments, function(apartment) {
        if (rooms === null || rooms < apartment.rooms) rooms = apartment.rooms;
    });
    return rooms;
});

// ##Método especials
// ###Método para obter o texto localizado ou o fallback se non está definido TODO
// ###Método para obter os apartamentos disponibles para un rango de data e unha ocupación de persoas
ApartmentSchema.method('availableApartmentsFor', function(from, to, people, callback) {
    var Booking = mongoose.model('Booking');
    var self = this;

    // Parseamos as datas
    from = new Date(parseInt(from));
    to = new Date(parseInt(to));

    var length_of_stay = moment(to).diff(moment(from), 'days'), // Duración da estancia
        fail = false; // Marcamolo como verdadeiro se non hay temporada para algunha data.

    // Cargamos as reservas do bloque
    Booking.find({apartment_block: self._id}).exec(function (err, bookings) {
        // Comprobamos a disponibilidade
        var apartments = _.map(self.apartments, function(apartment) {
            var on_demand = self.on_demand ? self.on_demand : apartment.on_demand;

            // Comprobamos se está pechado TODO
            if (apartment.closed.length > 0) {
                return false;
            }

            // Comprobamos se se cumpre a estancia mínima
            if (apartment.minimum_stay > length_of_stay) {
                return false;
            }

            // Comprobamos se é válido para o número de persoas
            if (people < apartment.minimum || people > apartment.maximum) {
                return false;
            }

            // Comprobamos se as reservas ocupan todos os apartamentos de este tipo
            if (/* ! on_demand && */bookings.length > 0) {
                var occupied = 0;
                _.each(bookings, function(booking) {
                    // So nos interesan as referidas a este apartamento en concreto
                    if (booking.apartment.equals(apartment._id)) {
                        if ((from >= booking.from && from < booking.to) || (to <= booking.to && to > booking.from)) {
                            occupied++;
                        }
                    }
                });
                if (apartment.quantity <= occupied) {
                    return false;
                }
            }

            // Obtemos as temporadas correspondentes as datas
            if (apartment.seasons.length < 1) {
                // Non se definiron temporadas
                fail = true;
                return false;
            } else {
                var current_season = null, // Variable para utilizar a hora de obter a temporada máis cara
                    prices = []; // Array para gardar os prezos e devolvelos se o apartamento está disponible.

                // Función para obter as temporadas que se usan na estancia
                var getSeasonsForStay = function (season) {
                    if (season.from <= current_date.toDate() && season.to > current_date.toDate()) {
                        return true;
                    }
                    return false;
                };

                // Obtemos a temporado co precio máis alto para a data que buscamos
                var getHighestPriceSeason = function (season) {
                    if (!current_season) {
                        current_season = season;
                    } else {
                        if (current_season.price < season.price) current_season = season;
                    }
                };

                // Obtemos o prezo de cada día
                for (var x = 0; x < length_of_stay; x++) {
                    // Obtemos a data para o día x da estancia
                    var current_date = moment(from).add(x, 'days');
                    var seasons = _.filter(apartment.seasons, getSeasonsForStay);

                    // Non hay temporadas para as datas da estancia
                    if (seasons.length < 1) {
                        return false;
                    } else {
                        // Reiniciamos a variable current_season para esta data
                        current_season = null;

                        // Obtemos a temporada co precio máis elevado
                        _.map(seasons, getHighestPriceSeason);

                        // Comprobamos a estancia mínima da temporada
                        if (current_season.minimum_stay > length_of_stay) {
                            return false;
                        }

                        prices.push({date: current_date.toDate(), price: current_season.price, season: current_season});
                    }
                }

                var total = 0;
                _.each(prices, function(price) {
                    total += price.price;
                });

                apartment.stay_prices = prices;
                apartment.stay_total = total;
                apartment.stay_length = length_of_stay;
                return apartment;
            }
        });

        callback({
            apartments: _.compact(apartments) || [],
            stay_length: length_of_stay,
            people: people,
            from: from,
            to: to
        });
    });
});

// Exportamos o modelo
module.exports = mongoose.model('Apartment', ApartmentSchema);
