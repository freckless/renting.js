// SpotService
// ===========
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('SpotService', function($resource) {
    return $resource(
        '/admin/spots/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});