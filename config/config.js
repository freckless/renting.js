'use strict';

/**
 * Modulo de configuracións
 * ------------------------
 * Este módulo crease para poder cargalas configuracións dende calqueira parte
 * da aplicación sen a necesidade de crear variables globales.
 */

/**
 * Dependencias do módulo
 */
var _ = require('lodash');

// Extendemos a configuración base coa configuración propia do entorno
var config = _.extend(
	require(__dirname + '/base.js'),
	require(__dirname + '/env/' + process.env.NODE_ENV + '.js')
);