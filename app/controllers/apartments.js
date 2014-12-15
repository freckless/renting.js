// #ApartmentsController
// Controlador que utilizaremos para a os apartamentos

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Apartment = mongoose.model('Apartment'),
    Country = mongoose.model('Country'),
    Province = mongoose.model('Province'),
    Town = mongoose.model('Town'),
    _ = require('lodash'),
    async = require('async'),
    BaseController = require(config.paths.controllers + 'base.js');

// ##Accións do controlador
var ApartmentsController = new BaseController({
    action_show: function(req, res) {
        Apartment.findOne({url: req.params.url}).populate(['country', 'province', 'town', 'services', 'user']).exec(function(err, data) {
            var search = req.method === 'POST' ? req.body : (req.cookies.search ? req.cookies.search : {});

            function render (apartments) {
                res.render('apartments/show', { apartment: data, apartments: apartments, search: search });
            }

            if (req.method === 'POST' || req.cookies.search) {
                res.cookie('search', search);
                data.availableApartmentsFor(search.from_timestamp, search.to_timestamp, search.people, function(apartments) {
                    render(apartments);
                });
            } else {
                render(false);
            }
        });
    },
    action_search: function(req, res) {
        var search = req.method === 'POST' ? req.body : (req.cookies.search ? req.cookies.search : {});
        res.cookie('search', search);
        var filtered_apartments = [];

        var doRender = function(data) {
            res.render('apartments/list', { apartments: data, search: search });
        }

        var doSearch = function(filters) {
            Apartment.find(filters).populate(['country', 'province']).exec(function(err, data) {
                if (err) { console.log(err); res.status(500).send(err); return false; }
                async.mapSeries(data, function(apartment_block, next) {
                    apartment_block.availableApartmentsFor(search.from_timestamp, search.to_timestamp, search.people, function(_apartments) {
                        if (_apartments.apartments.length > 0) {
                            var lower = 0;
                            _.each(_apartments.apartments, function(_ap) {
                                if (lower === 0 || _ap.stay_total < lower) {
                                    lower = _ap.stay_total;
                                }
                            });
                            apartment_block.stay_total = lower;
                            apartment_block.availableApartments = _apartments;
                            next(null, apartment_block);
                        } else {
                            next();
                        }
                    });
                }, function(err, data) {
                    doRender(_.compact(data));
                })
            });
        }

        var filters = {};
        if (search.place) {
            var placerx = new RegExp(search.place, 'i');

            Town.findOne({name: placerx}).exec(function(err, data) {
                if (data) {
                    if ( ! filters.$or) { filters.$or = []; };
                    filters.$or.push({town: data._id});
                }
                Province.findOne({name: placerx}).exec(function(err, data) {
                    if (data) {
                        if ( ! filters.$or) { filters.$or = []; };
                        filters.$or.push({province: data._id});
                    }
                    if ( ! filters.$or) {
                        filters.name = 'NOSEARCH';
                    }
                    doSearch(filters);
                });
            });
        } else {
            doSearch();
        }
    }
});

// ###Exportamos o módulo
module.exports = ApartmentsController;