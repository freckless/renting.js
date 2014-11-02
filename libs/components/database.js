// Database component
// ==================
// Este component ocuparase de cargar a configuración da base de datos,
// de iniciar a conexión e de cargar todos os modelos existentes.

'use strict';

// Dependencias do módulo
// ----------------------
var config = require(global.root_path + '/libs/config.js'),
    fs = require('fs'),
    mongoose = require('mongoose');

// Inizializamos a conexión a base de datos
mongoose.connect(config.db);

// Cargamos os modelos da base de datos
var models_path = config.paths.models;
// Función para a carga dos modelos, buscará os modelos no directorio de forma recursiva.
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
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
    });
};
// Comezamos a carga dende o directorio base dos modelos
walk(models_path);