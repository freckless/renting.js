// #Cargador dos "Helpers" Axudantes

'use strict';

// ##Dependencias do módulo
var config = global.config,
    _ = require('lodash'),
    html_helper = require(config.paths.helpers + 'html.js'),
    asset_helper = require(config.paths.helpers + 'asset.js'),
    formatter_helper = require(config.paths.helpers + 'formatter.js'),
    moment = require('moment');

var helpers = {
    // Pasamos a configuración da app
    config: config.app,
    html: html_helper,
    asset: asset_helper,
    formatter: formatter_helper,
    moment: moment
};

// Engadimos todos os helpers a resposta para acceder
// dende os controladores e as vistas.
module.exports = function() {
    return function(req, res, next) {
        res.locals = _.extend(res.locals, helpers);
        next();
    };
};