// RestUtils
// ==============
// Estas utilidades utilizanse para engadir routas a servicios rest
// de forma sinxela.
'use strict';

// ##Dependencias do módulo
var _ = require('lodash');

// ##Lóxica do módulo
var RestUtils = {
    addRoutes: function(resource, routes) {
        if ( ! routes['/'+resource]) routes['/'+resource] = {};
        if ( ! routes['/'+resource+'/:id']) routes['/'+resource+'/:id'] = {};

        _.extend(routes['/'+resource], {
            get: resource+'#find_all',
            post: resource+'#create'
        });

        _.extend(routes['/'+resource+'/:id'], {
            get: resource+'#find_one',
            put: resource+'#update',
            delete: resource+'#remove'
        });

        return routes;
    }
};

// ##Exportamos ó módulo
module.exports = RestUtils;