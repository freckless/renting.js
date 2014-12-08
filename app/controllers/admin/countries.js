// #AdminCountriesController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de cidades dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Country = mongoose.model('Country');

// ##Accións do controlador
var AdminCountriesController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminCountriesController = restComponent.call(AdminCountriesController, Country, {sort: {'name.es': 1}});

// ###Exportamos o modulo
module.exports = AdminCountriesController;
