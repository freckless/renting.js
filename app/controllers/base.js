// #BaseController
// Controlador que utilizaremos como interface para todos os
// demais controladores xa que con el poderemos crear accións comúns
// para todos os controladores seguindo un estandar.

'use strict';

// ##Dependencias do módulo
var _ = require('lodash');

// Lóxica do módulo e funcións da inferface
var BaseController = function(methods){
    this.extend(methods);
};

BaseController.prototype = {
    before: function(req, res, next) { next(); },
    after: function(req, res, next) { next(); },
    extend: function(methods) {
        _.extend(this, methods);
    }
};

// ###Exportamos o módulo
module.exports = BaseController;