// #HomeController
// Controlador que utilizaremos para a páxina principal do portal

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    _ = require('lodash'),
    Apartment = mongoose.model('Apartment'),
    BaseController = require(config.paths.controllers + 'base.js');

// ##Accións do controlador
var HomeController = new BaseController({
    action_index: function(req, res) {
        Apartment.find({featured: true}).select({
            name: true,
            'apartments.seasons.price': true,
            'apartments.seasons.from': true,
            'apartments.seasons.to': true,
            images: true,
            url: true,
            country: true,
            province: true
        }).populate(['country', 'province']).exec(function(err, data) {
            var search = req.cookies.search ? req.cookies.search : {};
            if (err) { res.status(500).send(err); return false; }
            var random_apartments = _.shuffle(data).slice(0, 12);
            res.render('home/index', { apartments: random_apartments, search: search });
        });
    }
});

// ###Exportamos o módulo
module.exports = HomeController;