// #Modulo de configuracións

// Este módulo crease para poder cargalas configuracións dende calqueira parte
// da aplicación sen a necesidade de crear variables globales.
'use strict';

// ##Dependencias do módulo
var _ = require('lodash');

// ##Exportamos a configuración
// Configuramos todos os cartafols da app por defecto que engadiremos á configuración
var root_path = global.root_path;
var libs_path = root_path + 'libs/';
var app_path = root_path + 'app/';
var webroot_path = root_path + 'public/';

var paths = {
    // common paths
    root: root_path,
    app: app_path,
    // config
    config: root_path + 'config/',
    // languages
    lang: app_path + 'lang/',
    // libraries
    utils: libs_path + 'utils/',
    helpers: libs_path + 'helpers/',
    components: libs_path + 'components/',
    // app
    controllers: app_path + 'controllers/',
    models: app_path + 'models/',
    views: app_path + 'views/',
    // public
    webroot: webroot_path,
    assets: webroot_path + 'assets/'
};

var config = _.extend(
    {paths: paths},
    require(paths.config + 'config.js'),
    require(paths.config + 'env/' + process.env.NODE_ENV + '.js')
);

global.config = config;

// ##Extendemos a configuración base coa configuración propia do entorno e a exportamos
module.exports = config;
