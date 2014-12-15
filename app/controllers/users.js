// #UsersController
// Controlador que utilizaremos para o login e rexistro dos usuarios

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    BaseController = require(config.paths.controllers + 'base.js'),
    AuthComponent = require(config.paths.components + 'auth.js');

// ##Accións do controlador
var UsersController = new BaseController({
    action_perform_login: function(req, res) {
        AuthComponent.authenticate(req, res, function(user) {
            if (user) {
                req.flash('success', global.i18n.translate('flash.welcome :user', { user: user.username }));
                if (req.body.redirect) {
                    res.redirect(req.body.redirect);
                } else {
                    res.redirect('/');
                }
            } else {
                req.flash('danger', global.i18n.translate('flash.username or password are wrong'));
                if (req.body.redirect) {
                    res.redirect(req.body.redirect);
                } else {
                    res.redirect('/');
                }
            }
        });
    },
    action_register: function(req, res) {
        var user = new User(req.body);
        user.save(function(err, data) {
            if (err) {
                req.flash('danger', global.i18n.translate('flash.'+err.name));
                res.cookie('errors', err);
                if (req.body.redirect) {
                    res.redirect(req.body.redirect);
                } else {
                    res.redirect('/');
                }
            } else {
                AuthComponent.authenticate(req, res, function(user) {
                    if (user) {
                        req.flash('success', global.i18n.translate('flash.welcome :user', { user: user.username }));
                        if (req.body.redirect) {
                            res.redirect(req.body.redirect);
                        } else {
                            res.redirect('/');
                        }
                    } else {
                        req.flash('danger', global.i18n.translate('flash.username or password are wrong'));
                        if (req.body.redirect) {
                            res.redirect(req.body.redirect);
                        } else {
                            res.redirect('/');
                        }
                    }
                });
            }
        });
    },
    action_logout: function(req, res) {
        AuthComponent.deauthenticate(req, res, function() {
            req.flash('info', global.i18n.translate('disconectect'));
            res.redirect('/');
        });
    }
});

// ###Exportamos o módulo
module.exports = UsersController;
