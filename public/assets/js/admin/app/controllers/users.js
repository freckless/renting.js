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
            }).
            when('/users/create', {
                templateUrl: 'assets/js/admin/views/users/form.html',
                controller: 'UsersCreateCtrl'
            }).
            when('/users/edit/:id', {
                templateUrl: 'assets/js/admin/views/users/form.html',
                controller: 'UsersEditCtrl',
                resolve: {
                    User: function(UserService, $route) {
                        return UserService.get({id: $route.current.params.id}).$promise;
                    }
                }
            });
    }
]);

/**
 * Definimos el controlador encargado de mostrar el listado de usuarios
 */
angular.module('adminApp').controller('UsersIndexCtrl', function($scope, $rootScope, Users) {
    $rootScope.current_section = 'users';
    $scope.users = Users;
});

/**
 * Definimos el controlador para crear nuevos usuarios
 */
angular.module('adminApp').controller('UsersCreateCtrl', function($scope, UserService) {
    $scope.groups = {
        'Admin': 2,
        'Owner': 3,
        'Customer': 4
    };
    $scope.user = new UserService();
    $scope.action = 'creating';
});

/**
 * Definimos el controlador encargado de mostrar los datos del usuario en un formulario y guardarlos
 */
angular.module('adminApp').controller('UsersEditCtrl', function($scope, $rootScope, User) {
    $scope.groups = {
        'Admin': 2,
        'Owner': 3,
        'Customer': 4
    };
    $rootScope.current_section = 'users';
    $scope.action = 'editing';
    $scope.user = User;
});