// #AdminTownsController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de cidades dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Town = mongoose.model('Town');

// ##Accións do controlador
var AdminTownsController = new AdminControllerBase({
});

// ##Facemos o controlador REST có modelo User
AdminTownsController = restComponent.call(AdminTownsController, Town);

// ###Exportamos o modulo
module.exports = AdminTownsController;
