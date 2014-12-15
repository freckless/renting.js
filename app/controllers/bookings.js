// #BookingsController
// Controlador que utilizaremos para a páxina principal do portal

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    _ = require('lodash'),
    Apartment = mongoose.model('Apartment'),
    Booking = mongoose.model('Booking'),
    Country = mongoose.model('Country'),
    BaseController = require(config.paths.controllers + 'base.js');

// ##Accións do controlador
var BookingsController = new BaseController({
    action_details: function(req, res) {
        Apartment.findOne({url: req.params.apartment_block}).populate(['user', 'country', 'province', 'town']).exec(function(err, apartment) {
            if (err || ! apartment) {
                res.status(404);
                res.render('404');
            } else {
                apartment.availableApartmentsFor(req.params.from, req.params.to, req.params.people, function(available_apartments) {
                    var selected_apartment = null;
                    _.each(available_apartments.apartments, function(available_apartment) {
                        if (available_apartment._id.equals(req.params.apartment)) {
                            selected_apartment = available_apartment;
                        } else {
                            return;
                        }
                    });

                    var errors = {};
                    if (req.cookies.errors) {
                        errors = req.cookies.errors;
                        res.cookie('errors', {});
                    }

                    if ( ! selected_apartment) {
                        req.flash('danger', global.i18n.translate('flash.apartment_not_available'));
                        res.redirect('/');
                    } else {
                        Country.find().exec(function(err, countries) {
                            res.render('bookings/details', {
                                errors: errors,
                                apartment: apartment,
                                selected_apartment: selected_apartment,
                                from: new Date(parseInt(req.params.from)),
                                to: new Date(parseInt(req.params.to)),
                                people: req.params.people,
                                countries: countries
                            });
                        });
                    }
                });
            }
        });
    },
    action_create: function(req, res) {
        Apartment.findOne({_id: req.body.apartment_block}).populate(['user', 'country', 'province', 'town']).exec(function(err, apartment) {
            apartment.availableApartmentsFor(req.body.from, req.body.to, req.body.people, function(available_apartments) {
                var selected_apartment = null;

                _.each(available_apartments.apartments, function(available_apartment) {
                    if (available_apartment._id.equals(req.body.apartment)) {
                        selected_apartment = available_apartment;
                    } else {
                        return;
                    }
                });

                if ( ! selected_apartment) {
                    req.flash('danger', global.i18n.translate('flash.apartment_not_available'));
                    res.redirect('/');
                } else {
                    var days = [];
                    _.each(selected_apartment.stay_prices, function(price) {
                        days.push({
                            day: price.date,
                            price: price.price
                        });
                    });
                    var booking = new Booking({
                        from: new Date(parseInt(req.body.from)),
                        to: new Date(parseInt(req.body.to)),
                        people: req.body.people,
                        confirmed: apartment.on_demand || selected_apartment.on_demand ? false : true,
                        paid: 0,
                        days: days,
                        total: selected_apartment.stay_total,
                        customer: res.locals.user._id,
                        owner: apartment.user,
                        apartment_block: apartment._id,
                        apartment: selected_apartment._id
                    });
                    booking.save(function(err, booking) {
                        if (booking.confirmed) {
                            res.render('bookings/finished', {
                                apartment: apartment,
                                booking: booking
                            });
                        } else {
                            res.render('bookings/finished', {
                                apartment: apartment,
                                booking: booking
                            });
                        }
                    });
                }
            });
        });
    }
});

// ###Exportamos o módulo
module.exports = BookingsController;