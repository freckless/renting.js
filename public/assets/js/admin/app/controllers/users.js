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
                    // Obtenemos todos los usuarios utilizando el servicio UserService
                    Users: function(UserService) {
                        return UserService.query().$promise;
                    }
                }
            }).
            when('/users/create', {
                templateUrl: 'assets/js/admin/views/users/form.html',
                controller: 'UsersCreateCtrl',
                resolve: {
                    // Creamos el nuevo Usuario
                    User: function(UserService) {
                        return new UserService();
                    }
                }
            }).
            when('/users/edit/:id', {
                templateUrl: 'assets/js/admin/views/users/form.html',
                controller: 'UsersFormCtrl',
                resolve: {
                    // Obtenemos el usuario que se va a utilizar utilizando el parámetro id
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
    // Definimos la sección actual
    $rootScope.current_section = 'users';

    // Definimos los usuarios en $scope
    $scope.users = Users;
});

/**
 * Definimos el controlador encargado de mostrar los datos del usuario en un formulario
 * si estamos editandolo y guardarlos
 */
angular.module('adminApp').controller('UsersFormCtrl', function($scope, $rootScope, User) {
    // Definimos la sección actual
    $rootScope.current_section = 'users';

    // Guardamos en $scope que tipo de acción estamos realizando
    $scope.action = User._id ? 'editing' : 'creating';

    // Definimos los grupos
    $scope.groups = {
        2: 'admin',
        3: 'owner',
        4: 'customer'
    };

    // Si el usuario es Root, añadimos root al listado de grupos
    if (User.group === 1) {
        $scope.groups[1] = 'root';
    }

    // Añadimos el usuario a $scope
    $scope.user = User;
});