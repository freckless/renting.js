// #AdminBaseController
// Controlador que utilizaremos como base para os controladores da
// administración xa que proporciona autenticación.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    _ = require('lodash'),
    AuthComponent = require(config.paths.components + 'auth.js');

// Lóxica do módulo e funcións da inferface
var AdminBaseController = function(methods){
    this.extend(methods);
};

AdminBaseController.prototype = {
    super_before: function(req, res, next) {
        AuthComponent.getUser(req, res, function (user) {
            if (user && [1, 2, 3].indexOf(user.group) > -1) {
                next();
            } else {
                if (user) {
                    // Si é un usuario sen privilexios diriximolo ó index
                    req.flash(global.i18n.translate('access_not_granted'));
                    res.redirect('/');
                } else {
                    // En caso de non estar logueado, dirixímolo o formulario de aceso
                    req.flash(global.i18n.translate('access_not_granted'));
                    res.redirect('/admin/login');
                }
            }
        });
    },
    before: function(req, res, next) {
        this.super_before(req, res, next);
    },
    after: function(req, res, next) { next(); },
    extend: function(methods) {
        _.extend(this, methods);
    }
};

// ###Exportamos o módulo
module.exports = AdminBaseController;