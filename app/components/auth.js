// Auth component
// ==============
// Este component ocuparase  do relacionado ca authenticación dos usuarios
// e engadirá á resposta da consulta os datos do usuario se é que está logueado.

'use strict';

// Dependencias do módulo
// ----------------------
var mongoose = require('mongoose'),
    User = mongoose.model('User');


var AuthComponent = {
    init: function() {
        return function(req, res, next) {
            if (req.session.user) {
                User.findOne({_id: req.session.user.id, token: req.session.user.token}).populate('role').exec(function(err, user) {
                    if (err) throw err;
                    if (user) {
                        res.locals.user = user;
                    } else {
                        delete(req.session.user);
                    }
                    next();
                });
            } else {
                next();
            }
        };
    },
    requiresAuth: function(options, req, res, next) {
        if (res.locals.user) {
            next();
        } else {
            this.loginRequired(options, req, res);
        }
    },
    loginRequired: function(options, req) {
        req.flash('error', 'Yout need to be logged in.');
    }
};

module.exports = AuthComponent;