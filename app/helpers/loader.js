// #Cargador dos "Helpers" Axudantes

'use strict';

// ##Dependencias do módulo
var config = require(global.root_path + '/config/loader.js'),
    _ = require('lodash'),
    html_helper = require(config.paths.helpers + '/html.js'),
    asset_helper = require(config.paths.helpers + '/asset.js');

var helpers = {
    // Pasamos a configuración da app
    config: {
        app: config.app
    },
    html: html_helper,
    asset: asset_helper
};

// Engadimos todos os helpers a resposta para acceder
// dende os controladores e as vistas.
module.exports = function() {
    return function(req, res, next) {
        res.locals = _.extend(res.locals, helpers);
        next();
    };
};