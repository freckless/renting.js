// ApartmentsController
// ====================
// Este controlador é o encargado de mostrar o listado dos apartamentos
// de cada usuario así como de manexar cada un de eses apartamentos,
// tarifas, imaxes, etc...

'use strict';

// Rutas
// -----
// Definimos as rutas para o controlador
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/apartments', {
                templateUrl: 'assets/js/admin/views/apartments/index.html',
                controller: 'ApartmentsIndexCtrl',
                resolve: {
                    Apartments: function(ApartmentService) {
                        return ApartmentService.query().$promise;
                    }
                }
            }).
            when('/apartments/create', {
                templateUrl: 'assets/js/admin/views/apartments/form.html',
                controller: 'ApartmentsFormCtrl',
                resolve: {
                    Apartment: function(ApartmentService) {
                        return new ApartmentService();
                    },
                    Spots: function(SpotService) {
                        return SpotService.query().$promise;
                    },
                    Countries: function(CountryService) {
                        return CountryService.query().$promise;
                    }
                }
            }).
            when('/apartments/edit/:id', {
                templateUrl: 'assets/js/admin/views/apartments/form.html',
                controller: 'ApartmentsFormCtrl',
                resolve: {
                    Apartment: function(ApartmentService, $route) {
                        return ApartmentService.get({id: $route.current.params.id});
                    }
                }
            });
    }
]);

// ##Controladores
// Creamos os controladores necesarios para manexar as vistas

// ###Controlador da páxina inicial
// Controlador encargado de mostrar a páxina inicial
angular.module('adminApp').controller('ApartmentsIndexCtrl', function($rootScope, $scope, Apartments) {
    // Definimos la sección actual
    $rootScope.current_section = 'apartments';

    // Definimos la lista de apartamentos
    $scope.apartments = Apartments;
});

// ###Controlador do formulario
// Controlador encargado de crear/modificar bloques de apartamentos
angular.module('adminApp').controller('ApartmentsFormCtrl', function($rootScope, $scope, Apartment, Spots, Countries, ProvinceService, TownService) {
    // Definimos la sección actual
    $rootScope.current_section = 'apartments';
    
    // Definimos en el $scope que tipo de acción estamos realizando
    $scope.action = Apartment._id ? 'editing' : 'creating';

    // Definimos el apartamento en $scope
    $scope.apartment = Apartment;

    // Definimos os emplazamentos
    $scope.spots = Spots;

    // Definimos os paises
    $scope.countries = Countries;
    console.log(Countries);

    // Definimos as provincias e cidades en blanco xa que só se cargarán o elexir os campos maiores
    $scope.provinces = $scope.towns = [];

    // Cargar as provincias relacionadas ó pais
    $scope.loadProvinces = function() {
        console.log('here');
        var country = $scope.apartment.country;
        $scope.provinces = ProvinceService.query({country: country});
    };

    // Cargar as cidades relacionadas a provincia
    $scope.loadTowns = function() {
        var province = $scope.apartment.province;
        $scope.towns = ProvinceService.query({country: province});
    };
});