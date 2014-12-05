'use strict';

var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

// ##Accións do controlador
var AdminUsersController = new AdminControllerBase({
});

// ##Load REST actions
AdminUsersController = restComponent.call(AdminUsersController, User, ['country']);

// Exportamos o controlador
module.exports = AdminUsersController;
