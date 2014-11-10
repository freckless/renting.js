// Auth component
// ==============
// Este component ocuparase  do relacionado ca authenticación dos usuarios
// e engadirá á resposta da consulta os datos do usuario se é que está logueado.

'use strict';

// Dependencias do módulo
// ----------------------
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    crypto = require('crypto');

// Lóxica do compoñente
var AuthComponent = {
    init: function() {
        var that = this;
        return function(req, res, next) {
            if (req.session.user) {
                that.getUser(req, res, function(user) {
                    if (user) {
                        res.locals.user = user;
                    }
                    next();
                });
            } else {
                next();
            }
        };
    },
    getUser: function(req, res, next) {
        if (res.locals.user) {
            next(res.locals.user);
        } else {
            if (req.session.user) {
                var that = this;
                User.findOne({_id: req.session.user.id, token: req.session.user.token}).exec(function(err, user) {
                    if (err) throw err;
                    if (user) {
                        res.locals.user = user;
                        next(user);
                    } else {
                        next(false);
                    }
                });
            } else {
                next(false);
            }
        }
    },
    authenticate: function(req, res, callback) {
        User.findOne({username: req.body.username}, function(err, user) {
            if (err) throw err;
            if (user) {
                if (user.authenticate(req.body.password)) {
                    var token = crypto.randomBytes(16).toString('base64');
                    user.token = token;
                    user.save(function(err) {
                        if (err) console.log(err);
                        req.session.user = {
                            id: user._id,
                            token: token
                        };
                        callback(user);
                    });
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        });
    },
    deauthenticate: function(req, res, callback) {
        delete(req.session.user);
        callback();
    }
};

module.exports = AuthComponent;