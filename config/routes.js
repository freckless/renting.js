// #Rutas

// Neste arquivo están as rutas por defecto da app
// se queremos engadir novas accións públicas debemos
// de engadilas a este arquivo.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    rest = require(config.paths.utils + 'rest.js');

// ##Rutas da app
// Para que a acción do controlador poda ser executada debe nomearse action_{{acción}}<br>
// Ex. a acción index deberá nomearse action_index no controlador.
// <pre><code>
//  routes = {
//      'url': {
//          'método': 'controller#acción'
//      }
//  };
// </code></pre>
var routes = {
    '/': {
        get: 'home#index'
    },
    '/apartment/:url': {
        get: 'apartments#show',
        post: 'apartments#show'
    },
    '/bookings/:apartment_block/:apartment/:from/:to/:people': {
        get: 'bookings#details',
        post: 'bookings#create'
    },
    '/search': {
        get: 'apartments#search',
        post: 'apartments#search'
    },
    '/users/login': {
        post: 'users#perform_login'
    },
    '/users/register': {
        post: 'users#register'
    },
    // Rutas do panel de xestion
    '/admin': {
        get: 'admin/app#index'
    },
    '/admin/login': {
        get: 'admin#login',
        post: 'admin#perform_login'
    },
    '/admin/logout': {
        get: 'admin#logout'
    },
    // Rutas extra para os apartamentos no panel de xestión
    '/admin/apartments/upload': {
        post: 'admin/apartments#upload'
    },
    // Rutas extra para os usuarios no panel de xestión
    '/admin/users/upload': {
        post: 'admin/users#upload'
    }
};

// ##Compartindo as traduccións entre cliente e servidor
routes['/locale'] = {
    get: function(req, res) {
        res.json(global.i18n.translations);
    }
};

// ##REST routes
routes = rest.addRoutes('admin/users', routes);
routes = rest.addRoutes('admin/apartments', routes);
routes = rest.addRoutes('admin/spots', routes);
routes = rest.addRoutes('admin/countries', routes);
routes = rest.addRoutes('admin/provinces', routes);
routes = rest.addRoutes('admin/towns', routes);
routes = rest.addRoutes('admin/services', routes);
routes = rest.addRoutes('admin/bookings', routes);

module.exports = routes;