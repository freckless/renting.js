'use strict';

/**
 * Definimos as rutas para este controlador
 */
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: 'assets/js/admin/views/dashboard/index.html',
                controller: 'DashboardCtrl'
            });
    }
]);

angular.module('adminApp').controller('DashboardCtrl', ['$rootScope', function($rootScope) {
    $rootScope.current_section = 'dashboard';
}]);