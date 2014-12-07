// #AdminUsersController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de usuarios dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

// ##Accións do controlador
var AdminUsersController = new AdminControllerBase({

});

// ##Facemos o controlador REST có modelo User
AdminUsersController = restComponent.call(AdminUsersController, User);

// ###Exportamos o modulo
module.exports = AdminUsersController;
