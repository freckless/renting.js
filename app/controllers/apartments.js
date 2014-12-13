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
        Apartment.findOne({url: req.params.url}).populate(['country', 'province']).exec(function(err, data) {
            res.render('apartments/show', { apartment: data });
        });
    }
});

// ###Exportamos o módulo
module.exports = ApartmentsController;