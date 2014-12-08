// ApartmentService
// ================
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('ApartmentService', function($resource) {
    return $resource(
        '/admin/apartments/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});