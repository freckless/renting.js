// BookingsController
// ====================
// Este controlador é o encargado de mostrar o listado das reservas
// que se han realizado en cada un dos apartamentos do usuario e
// xestionalas (confirmar, cancelar...)

'use strict';

// Rutas
// -----
// Definimos as rutas para o controlador
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/bookings', {
                templateUrl: 'assets/js/admin/views/bookings/index.html',
                controller: 'BookingsIndexCtrl'
            });
    }
]);

// ##Controladores
// Creamos os controladores necesarios para manexar as vistas

// ###Controlador da páxina inicial
// Controlador encargado de mostrar a páxina inicial
angular.module('adminApp').controller('BookingsIndexCtrl', ['$rootScope', function($rootScope) {
    $rootScope.current_section = 'bookings';
}]);