// TownService
// ===========
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('TownService', function($resource) {
    return $resource(
        '/admin/towns/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});