'use strict';

// #Configuración da app "adminApp"
angular.module('adminApp').config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);

// #Engadindo $location ó rootScope así poderemos acceder a esta variable dende as vistas.
angular.module('adminApp').run(
    function($rootScope, $location) {
        $rootScope.$location = $location;
    }
);