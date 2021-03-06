// UserService
// ===========
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('UserService', function($resource) {
    return $resource(
        '/admin/users/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});