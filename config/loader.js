// #Modulo de configuracións

// Este módulo crease para poder cargalas configuracións dende calqueira parte
// da aplicación sen a necesidade de crear variables globales.
'use strict';

// ##Dependencias do módulo
var _ = require('lodash');

// ##Exportamos a configuración
// Configuramos todos os cartafols da app por defecto que engadiremos á configuración
var root_path = global.root_path;
var app_path = root_path + '/app';
var webroot_path = root_path + '/public';

var paths = {
    // common paths
    root: root_path,
    app: app_path,
    // config
    config: root_path + '/config',
    // libraries
    utils: app_path + '/utils',
    helpers: app_path + '/helpers',
    components: app_path + '/components',
    // app
    controllers: app_path + '/controllers',
    models: app_path + '/models',
    views: app_path + '/views',
    // public
    webroot: webroot_path,
    assets: webroot_path + '/assets',
};

// ##Extendemos a configuración base coa configuración propia do entorno e a exportamos
module.exports = _.extend(
    {paths: paths},
    require(paths.config + '/config.js'),
    require(paths.config + '/env/' + process.env.NODE_ENV + '.js')
);