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

// #Configuramos a execución da app "adminApp"
angular.module('adminApp').run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$location = $location;
}]);