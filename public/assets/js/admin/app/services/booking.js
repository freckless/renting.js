// BookingService
// ==============
// Modelo encargado de intercambiar información entre
// o cliente e o servidor.

'use strict';

// Loxica do modelo
// ----------------
angular.module('adminApp').factory('BookingService', function($resource) {
    return $resource(
        '/admin/bookings/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});