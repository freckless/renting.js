// Auth component
// ==============
// Este component ocuparase de todo o relacionado ca authenticación dos usuarios
// e engadirá á resposta da consulta os datos do usuario se é que está logueado.

'use strict';

// Dependencias do módulo
// ----------------------
// var mongoose = require('mongoose');
//    crypto = require('crypto'),
//    User = mongoose.model('User');

// TO-DO: Aínda sen implementar
var AuthComponent = {
    init: function() {
        return function(req, res, next) {
            next();
        };
    }
};

module.exports = AuthComponent;