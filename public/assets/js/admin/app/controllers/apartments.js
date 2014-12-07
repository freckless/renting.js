// Apartments Controller
// ====================
// Este controlador é o encargado de mostrar o listado dos apartamentos
// de cada usuario así como de manexar cada un de eses apartamentos,
// tarifas, imaxes, etc...

'use strict';

// Rutas
// -----
// Definimos as rutas para o controlador
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/apartments', {
                templateUrl: 'assets/js/admin/views/apartments/index.html',
                controller: 'ApartmentsIndexCtrl'
            });
    }
]);

// ##Controladores
// Creamos os controladores necesarios para manexar as vistas

// ###Controlador da páxina inicial
// Controlador encargado de mostrar a páxina inicial
angular.module('adminApp').controller('ApartmentsIndexCtrl', ['$rootScope', function($rootScope) {
    $rootScope.current_section = 'apartments';
}]);