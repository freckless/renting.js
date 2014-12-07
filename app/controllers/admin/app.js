// #AdminAppController
// Controlador que utilizaremos para a lanzar a aplicación do panel de xestión

'use strict';

// ##Dependencias do módulo
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js');

// ##Accións do controlador
var AdminAppController = new AdminControllerBase({
    // Soamente mostramos a vista da app, ela é a encargada de cargar toda a lóxica do panel de xestión.
    action_index: function(req, res) {
        res.render('admin/app', { layout: false });
    }
});

// ###Exportamos o módulo
module.exports = AdminAppController;
