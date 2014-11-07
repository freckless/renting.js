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
    }
};

module.exports = routes;