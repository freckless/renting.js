// CountryService
// ==============
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('CountryService', function($resource) {
    return $resource(
        '/admin/countries/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});