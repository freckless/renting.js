// Modulo do servidor
// ==================
// Modulo que inicia a escoita do servidor web, carga as configuracións
// e inicializa a conexión coa base de datos, os modelos, etc...

'use strict';

// Dependencias do módulo
// ----------------------
var express = require('express'),
    path = require('path');

// Bootstrap
// ---------
// Configuramos o entorno se non está configurado
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Configuramos a carpeta raiz no ambito global
global.root_path = path.normalize(__dirname) + '/';

// Cargamos as configuracións
var config = require(global.root_path + 'config/loader.js');

// Iniciamos a conexión da base de datos e cargamos os módulos
require(config.paths.components + 'database.js');

// Inizializamos o servidor
var app = express();

// Cargamos a configuración do servidor
require(config.paths.config + 'express.js')(app);

if (typeof(process.console) === 'undefined') {
    // Lanzamos o servidor pondoo a escoita no porto elexido
    app.listen(app.get('port'), function() {
        console.log(config.app.name + ' started on port ' + app.get('port'));
    });
}

// Expoñemos a app ó ámbito global
global.app = app;

// Exportamos a app
module.exports = app;