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
AdminCountriesController = restComponent.call(
    AdminCountriesController,
    Country,
    function(req, res, next) {
        // Ordeamos os resultados polo nome no idioma actual
        var sort = {};
        sort['name.'+global.i18n.language] = 1;
        this.sort(sort);
        
        next();
    }
);

// ###Exportamos o modulo
module.exports = AdminCountriesController;
