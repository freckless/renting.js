'use strict';

/**
 * Definimos as rutas para este controlador
 */
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: '/apps/admin/views/dashboard/index.html',
                controller: 'DashboardCtrl'
            });
    }
]);

angular.module('adminApp').controller('DashboardCtrl', ['$scope', function($scope) {
}]);