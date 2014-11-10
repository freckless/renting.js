// #Home Controller
// Controlador que utilizaremos para a páxina principal do portal

'use strict';

// ##Dependencias do módulo
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js');

// ##Accións do controlador
var AdminDashboardController = new AdminControllerBase({
    action_index: function(req, res) {
        res.render('admin/dashboard/index', { layout: 'admin/template' });
    }
});

// Exportamos o controlador
module.exports = AdminDashboardController;