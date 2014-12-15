// #AdminBookingsController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de spots (emplazamentos) dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Booking = mongoose.model('Booking');

// ##Accións do controlador
var AdminBookingsController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminBookingsController = restComponent.call(AdminBookingsController, Booking, function(req, res, next) {
    this.populate(['customer']);
    this.where('apartment_block', req.query.apartment_block)
    // Se non é administrador so lle deixamos acceder as reservas dos seus apartamentos
    if (res.locals.user.group > 2) {
        this.where('owner', res.locals.user._id);
        next();
    } else {
        next();
    }
});

// ###Exportamos o modulo
module.exports = AdminBookingsController;
