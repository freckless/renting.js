// #HomeController
// Controlador que utilizaremos para a páxina principal do portal

'use strict';

// ##Dependencias do módulo
var config = global.config,
    BaseController = require(config.paths.controllers + 'base.js');

// ##Accións do controlador
var HomeController = new BaseController({
    action_index: function(req, res) {
        res.render('home/index', { layout: 'template' });
    }
});

// ###Exportamos o módulo
module.exports = HomeController;