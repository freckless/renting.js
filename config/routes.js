// #Rutas

// Neste arquivo están as rutas por defecto da app
// se queremos engadir novas accións públicas debemos
// de engadilas a este arquivo.

'use strict';

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
    '/admin/users': {
        get: 'admin/users#find_all',
        post: 'admin/users#create'
    },
    '/admin/users/:id': {
        get: 'admin/users#find_one',
        put: 'admin/users#update',
        delete: 'admin/users#remove'
    }
};

module.exports = routes;