// #Home Controller
// Controlador que utilizaremos para a páxina principal do portal

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

// Exportamos o controlador
module.exports = AdminAppController;