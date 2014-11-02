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
// Configuramos todos os cartafols da app por defecto que engadiremos á configuración
var root_path = global.root_path;
var app_path = root_path + '/app';
var webroot_path = root_path + '/public';
var paths = {
    root: root_path,
    app: app_path,
    config: root_path + '/config',
    libs: root_path + '/libs',
    controllers: app_path + '/controllers',
    helpers: app_path + '/helpers',
    models: app_path + '/models',
    views: app_path + '/views',
    webroot: webroot_path,
    assets: webroot_path + '/assets'
};

// Extendemos a configuración base coa configuración propia do entorno
module.exports = _.extend(
    {paths: paths},
    require(paths.config + '/config.js'),
    require(paths.config + '/env/' + process.env.NODE_ENV + '.js')
);