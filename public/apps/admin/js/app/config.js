'use strict';

// #Configuración da app "adminApp"
angular.module('adminApp').config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);

// #Engadindo $location ó rootScope así poderemos acceder a esta variable dende as vistas.
angular.module('adminApp').run(
    function() {}
);