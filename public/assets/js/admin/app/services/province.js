// ProvinceService
// ===============
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('ProvinceService', function($resource) {
    return $resource(
        '/admin/provinces/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});