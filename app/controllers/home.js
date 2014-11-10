// #Home Controller
// Controlador que utilizaremos para a páxina principal do portal

'use strict';

// ##Dependencias do módulo
var config = global.config,
    ControllerBase = require(config.paths.controllers + 'base.js');

// ##Accións do controlador
var HomeController = new ControllerBase({
    action_index: function(req, res) {
        res.render('home/index', { layout: 'template' });
    }
});

// Exportamos o controlador
module.exports = HomeController;