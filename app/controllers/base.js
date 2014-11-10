// #ControllerBase
// Controlador que utilizaremos como interface para todos os
// demais controladores xa que con el poderemos crear accións comúns
// para todos os controladores seguindo un estandar.

'use strict';

// ##Dependencias do módulo
var _ = require('lodash');

// Lóxica do módulo e funcións da inferface
var ControllerBase = function(methods){
    this.extend(methods);
};

ControllerBase.prototype = {
    before: function(req, res, next) { next(); },
    after: function(req, res, next) { next(); },
    extend: function(methods) {
        _.extend(this, methods);
    }
};

// Exportamos o módulo
module.exports = ControllerBase;