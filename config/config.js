// Modulo de configuracións
// ========================
// Este módulo crease para poder cargalas configuracións dende calqueira parte
// da aplicación sen a necesidade de crear variables globales.
'use strict';

// Dependencias do módulo
// ----------------------
var _ = require('lodash');

// Exportamos a configuración
// --------------------------
// Extendemos a configuración base coa configuración propia do entorno
module.exports = _.extend(
	require(__dirname + '/base.js'),
	require(__dirname + '/env/' + process.env.NODE_ENV + '.js')
);