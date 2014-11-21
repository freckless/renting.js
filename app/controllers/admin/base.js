// #AdminControllerBase
// Controlador que utilizaremos como base para os controladores da
// administración xa que proporciona autenticación.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    i18n = global.i18n,
    _ = require('lodash'),
    AuthComponent = require(config.paths.components + 'auth.js');

// Lóxica do módulo e funcións da inferface
var AdminControllerBase = function(methods){
    this.extend(methods);
};

AdminControllerBase.prototype = {
    before: function(req, res, next) {
        AuthComponent.getUser(req, res, function (user) {
            if (user && [1, 2].indexOf(user.group) > -1) {
                next();
            } else {
                if (user) {
                    // Si é un usuario sen privilexios diriximolo ó index
                    req.flash(i18n.translate('access_not_granted'));
                    res.redirect('/');
                } else {
                    // En caso de non estar logueado, dirixímolo o formulario de aceso
                    req.flash(i18n.translate('access_not_granted'));
                    res.redirect('/admin/login');
                }
            }
        });
    },
    after: function(req, res, next) { next(); },
    extend: function(methods) {
        _.extend(this, methods);
    }
};

// Exportamos o módulo
module.exports = AdminControllerBase;