// #AdminApartmentsController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de apartamentos dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Apartment = mongoose.model('Apartment');

// ##Accións do controlador
var AdminApartmentsController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminApartmentsController = restComponent.call(AdminApartmentsController, Apartment, function(req, res, next) {
    if (req.action === 'find_all') {
        this.populate('country').populate('province').populate('town');
        next();
    } else {
        next();
    }
});

// ###Exportamos o modulo
module.exports = AdminApartmentsController;
