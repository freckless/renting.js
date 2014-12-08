// #AdminProvincesController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de provincias dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Province = mongoose.model('Province');

// ##Accións do controlador
var AdminProvincesController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminProvincesController = restComponent.call(AdminProvincesController, Province);

// ###Exportamos o modulo
module.exports = AdminProvincesController;
