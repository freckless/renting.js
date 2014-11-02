// Cargador dos "Helpers" Axudantes
// ================================

'use strict';

// Dependencias do módulo
// ----------------------
var config = require(global.root_path + '/libs/config.js'),
    _ = require('lodash');

var helpers = {
    // Pasamos a configuración da app
    config: {
        app: config.app
    }
};

// Engadimos todos os helpers a resposta para acceder
// dende os controladores e as vistas.
module.exports = function() {
    return function(req, res, next) {
        res.locals = _.extend(res.locals, helpers);
        next();
    };
};