// #ApartmentsController
// Controlador que utilizaremos para a os apartamentos

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Apartment = mongoose.model('Apartment'),
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
    }
});

// ###Exportamos o módulo
module.exports = ApartmentsController;