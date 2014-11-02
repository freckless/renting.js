// Home Controller
// ===============
// Controlador que utilizaremos para a páxina principal do portal

'use strict';

// Dependencias do módulo
// ----------------------

// Accións do controlador
// ----------------------
var HomeController = {
    action_index: function(req, res) {
        res.end('Wow!');
    }
};

// Exportamos o controlador
// ------------------------
module.exports = HomeController;