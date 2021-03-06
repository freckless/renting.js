// #AdminSpotsController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de spots (emplazamentos) dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Spot = mongoose.model('Spot');

// ##Accións do controlador
var AdminSpotsController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminSpotsController = restComponent.call(AdminSpotsController, Spot, function(req, res, next) {
    var sort = {};
    sort['name.'+global.i18n.language] = 1;
    this.sort(sort);
    next();
});

// ###Exportamos o modulo
module.exports = AdminSpotsController;
