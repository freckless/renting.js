'use strict';

/**
 * Definimos as rutas para este controlador
 */
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/users', {
                templateUrl: '/apps/admin/views/users/index.html',
                controller: 'UsersCtrl'
            });
    }
]);

angular.module('adminApp').controller('UsersCtrl', ['$scope', function($scope) {
}]);