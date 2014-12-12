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
AdminUsersController = restComponent.call(AdminUsersController, User, function(req, res, next) {
    // Se non é administrador so lle deixamos acceder o seu perfil
    if (res.locals.user.group > 2 && (typeof(req.params.id) == 'undefined' || req.params.id != res.locals.user._id)) {
        res.status(403).send('Forbidden');
    } else {
        next();
    }
});

// ###Exportamos o modulo
module.exports = AdminUsersController;
