// Dashboard Controller
// ====================
// Este controlador é o encargado de mostrar a páxina principal do
// panel de xestión onde nun futuro podense engadir estadísticas, etc..

'use strict';

// Rutas
// -----
// Definimos as rutas para o controlador
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: 'assets/js/admin/views/dashboard/index.html',
                controller: 'DashboardCtrl'
            });
    }
]);

// ##Controladores
// Creamos os controladores necesarios para manexar as vistas

// ###Controlador da páxina inicial
// Controlador encargado de mostrar a páxina inicial
angular.module('adminApp').controller('DashboardCtrl', ['$rootScope', function($rootScope) {
    $rootScope.current_section = 'dashboard';
}]);