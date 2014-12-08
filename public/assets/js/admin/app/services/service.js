// ServiceService
// ===============
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('ServiceService', function($resource) {
    return $resource(
        '/admin/services/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});