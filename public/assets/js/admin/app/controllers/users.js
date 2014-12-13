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
                controller: 'UsersFormCtrl',
                resolve: {
                    // Creamos el nuevo Usuario
                    User: function(UserService) {
                        return new UserService();
                    },
                    Countries: function(CountryService) {
                        return CountryService.query();
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
                    },
                    Countries: function(CountryService) {
                        return CountryService.query();
                    }
                }
            });
    }
]);

/**
 * Definimos el controlador encargado de mostrar el listado de usuarios
 */
angular.module('adminApp').controller('UsersIndexCtrl', function($scope, $rootScope, $filter, $flash, $timeout, Users) {
    // Definimos la sección actual
    $rootScope.current_section = 'users';

    // Definimos los usuarios en $scope
    $scope.users = Users;

    // Definimos la función para eliminar a usuarios
    $scope.deleteUser = function($index) {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.users[$index].$delete(function() {
                $flash.set('success', 'admin.object_has_been_removed');
                $flash.show();
                $scope.users.splice($index, 1);
            });
        }
    };
});

/**
 * Definimos el controlador encargado de mostrar los datos del usuario en un formulario
 * si estamos editandolo y guardarlos
 */
angular.module('adminApp').controller('UsersFormCtrl', function($scope, $rootScope, $filter, $location, $flash, User, Countries) {
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

    // Definimos os paises
    $scope.countries = Countries;

    // Añadimos el usuario a $scope
    $scope.user = User;

    // Datepicker
    $scope.dateOptions = {
        startingDay: 1,
        showWeeks: false,
        showButtonBar: false
    };
    $scope.openDatePicker = function() {
        $scope.opened = true;
    };

    // Si el usuario es Root, añadimos root al listado de grupos
    if (User.group === 1) {
        $scope.groups[1] = 'root';
    }
    
    // Enviamos os datos do usuario o servidor    
    $scope.saveUser = function() {
        // Gardamos a contraseña se se escribiu unha nova
        if ($scope.password) {
            $scope.user.password = $scope.password;
        }

        // Se é unha actualización executamos o método $update e se non, $save.
        if ($scope.user._id) {
            $scope.user.$update(function() {
                $flash.set('success', 'admin.changes_has_been_saved');

                // Se o usuario non é administrador voltamos o dashboard, se o é, a páxina de usuarios
                if ($rootScope.user.group > 2) {
                    $location.path('/');
                } else {
                    $location.path('/users');
                }
            });
        } else {
            $scope.user.$save(function () {
                $flash.set('success', 'admin.changes_has_been_saved');
                $location.path('/users');
            });
        }
    };

    $scope.uploadStart = function() {};

    // Callback para cando termina de subir unha imaxe
    $scope.uploadComplete = function(response) {
        $scope.user.image = response.data;
        $scope.form.$setDirty();
    };

    // Función para eliminar a imaxe
    $scope.deleteImage = function() {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.user.image = null;
        }
    };

    // Cancelamos a acción e voltamos atrás sen gardar ningún cambio
    $scope.cancel = function() {
        // Se o formulario foi modificado preguntamos ó
        // usuario se está seguro de cancelar.
        if ( ! $scope.form.$pristine) {
            if ( ! confirm($filter('translate')('admin.are_you_sure'))) {
                return false;
            }
        }
        window.history.back();
    };
});