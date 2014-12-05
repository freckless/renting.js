'use strict';

/**
 * Definimos as rutas para este controlador
 */
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/users', {
                templateUrl: 'assets/js/admin/views/users/index.html',
                controller: 'UsersIndexCtrl',
                resolve: {
                    Users: function(UserService) {
                        return UserService.query().$promise;
                    }
                }
            });
    }
]);

angular.module('adminApp').controller('UsersIndexCtrl', function($scope, $rootScope, Users) {
    $rootScope.current_section = 'users';
    $scope.users = Users;
});