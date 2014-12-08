// #AdminServicesController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de servizos dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Service = mongoose.model('Service');

// ##Accións do controlador
var AdminServicesController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminServicesController = restComponent.call(AdminServicesController, Service, function(req, res, next) {
    var sort = {};
    sort['name.'+global.i18n.language] = 1;
    this.sort(sort);
    next();
});

// ###Exportamos o modulo
module.exports = AdminServicesController;
