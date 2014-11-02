'use strict';

/**
 * Modulo do servidor
 * ------------------------
 * Modulo que inicia a escoita do servidor web, carga as configuracións
 * e inicializa a conexión coa base de datos, os modelos, etc...
 */

/**
 * Dependencias
 */
var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose');

// Configuramos o entorno se non está configurado
process.env.NODE_ENV = process.env.NODE_ENV ||  'development';

// Cargamos as configuracións
var config = require('./config/config.js');

// Inizializamos a conexión a base de datos
// var db = mongoose.connect(config.db);

// Cargamos os modelos da base de datos
var models_path = __dirname + '/app/models';
// Función para a carga dos modelos, buscará os modelos no directorio de forma recursiva.
var walk = function (path) {
    fs.readdirSync(path).foreach(function (file) {
        // Obtemos a ruta completa do arquivo
        var model_file = path + '/' + file;

        // Recollemos información do arquivo
        var stat = fs.statSync(model_file);

        // Se é un arquivo cargámolo e se é un directorio
        // buscamos os modelos dentro de este.
        if (stat.isFile()) {
            if (/(.*)\.js/.test(file)) {
                require(model_file);
            }
        } else if (stat.isDirectory()) {
            walk(model_file);
        }
    })
}
// Comezamos a carga dende o directorio base dos modelos
walk(models_path);

// Inizializamos o servidor
var app = express();

// Cargamos a configuración do servidor
require('./config/express')(app, db);

// Lanzamos o servidor pondoo a escoita no porto elexido
var port = process.env.PORT ||  config.port;
app.listen(port);
console.log('App started on port ' + port);

// Exportamos a app
module.exports = app;