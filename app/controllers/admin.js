// #AdminController
// Controlador que utilizaremos para o login e acceso o panel de xestión

'use strict';

// ##Dependencias do módulo
var config = global.config,
    BaseController = require(config.paths.controllers + 'base.js'),
    AuthComponent = require(config.paths.components + 'auth.js');

// ##Accións do controlador
var AdminController = new BaseController({
    action_login: function(req, res) {
        res.render('admin/login', { layout: false });
    },
    action_perform_login: function(req, res) {
        AuthComponent.authenticate(req, res, function(user) {
            if (user) {
                req.flash('info', global.i18n.translate('welcome :user', { user: user.username }));
                res.redirect('/admin');
            } else {
                req.flash('info', global.i18n.translate('username or password are wrong'));
                res.redirect('/admin/login');
            }
        });
    },
    action_logout: function(req, res) {
        AuthComponent.deauthenticate(req, res, function() {
            req.flash('info', global.i18n.translate('disconectect'));
            res.redirect('/admin/login');
        });
    }
});

// ###Exportamos o módulo
module.exports = AdminController;
