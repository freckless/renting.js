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
                        return new ApartmentService({services: []});
                    },
                    Spots: function(SpotService) {
                        return SpotService.query().$promise;
                    },
                    Countries: function(CountryService) {
                        return CountryService.query().$promise;
                    },
                    Services: function(ServiceService) {
                        return ServiceService.query().$promise;
                    }
                }
            }).
            when('/apartments/edit/:id', {
                templateUrl: 'assets/js/admin/views/apartments/form.html',
                controller: 'ApartmentsFormCtrl',
                resolve: {
                    Apartment: function(ApartmentService, $route) {
                        return ApartmentService.get({id: $route.current.params.id});
                    },
                    Spots: function(SpotService) {
                        return SpotService.query().$promise;
                    },
                    Countries: function(CountryService) {
                        return CountryService.query().$promise;
                    },
                    Services: function(ServiceService) {
                        return ServiceService.query().$promise;
                    }
                }
            }).
            when('/apartments/apartments/:id', {
                templateUrl: 'assets/js/admin/views/apartments/apartments.html',
                controller: 'ApartmentsApartmentsCtrl',
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
angular.module('adminApp').controller('ApartmentsFormCtrl', function($rootScope, $scope, $translate, $flash, $location, Apartment, Spots, Countries, Services, ProvinceService, TownService) {
    // Definimos la sección actual
    $rootScope.current_section = 'apartments';

    // Definimos o idioma de edición por defecto
    $scope.active_language = $translate.use();

    // Definimos el apartamento en $scope
    $scope.apartment = Apartment;

    // Definimos os emplazamentos
    $scope.spots = Spots;

    // Definimos os servicios dispoñibles
    $scope.services = Services;

    // Definimos os paises
    $scope.countries = Countries;

    // Definimos as provincias e cidades en blanco xa que só se cargarán o elexir os campos maiores
    $scope.provinces = $scope.towns = [];

    // Cambiar o idioma de edición
    $scope.setActiveLanguage = function(language) {
        $scope.active_language = language;
    };

    // Cargar as provincias relacionadas ó pais
    $scope.loadProvinces = function() {
        var country = $scope.apartment.country;
        if (country) {
            $scope.provinces = ProvinceService.query({country: country});
        } else {
            $scope.provinces = [];
            $scope.towns = [];
        }
    };

    // Cargar as cidades relacionadas a provincia
    $scope.loadTowns = function() {
        var province = $scope.apartment.province;
        if (province) {
            $scope.towns = TownService.query({province: province});
        } else {
            $scope.towns = [];
        }
    };

    // Definimos en el $scope que tipo de acción estamos realizando y
    // cargamos las provincias y ciudades
    if (Apartment._id) {
        $scope.action = 'editing';
        $scope.loadProvinces();
        $scope.loadTowns();
    } else {
        $scope.action = 'creating';
    }

    // Comprobar se o servizo está activo
    $scope.activedService = function($id) {
        if ($scope.apartment.services.indexOf($id) !== -1) {
            return true;
        }
        return false;
    };

    // Cambiar o estado do servizo
    $scope.toggleService = function($id) {
        if ($scope.activedService($id)) {
            var index = $scope.apartment.services.indexOf($id);
            $scope.apartment.services.splice(index, 1);
        } else {
            $scope.apartment.services.push($id);
        }
        $scope.form.$setDirty();
    };

    // Cancelamos a acción e volvemos atrás sen gardar ningún cambio
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

    // Gardamos o apartamento
    $scope.saveApartment = function() {
        // Se é unha actualización executamos o método $update e se non, $save.
        if ($scope.apartment._id) {
            $scope.apartment.$update(function() {
                $flash.set('success', 'admin.changes_has_been_saved');
                $location.path('/apartments');
            });
        } else {
            $scope.apartment.$save(function() {
                $flash.set('success', 'admin.changes_has_been_saved');
                $location.path('/apartments');
            });
        }
    };

    // Mapa
    var map = null;
    var marker = null;
    // Coordenadas por defecto en España
    var coords = [40.41153868,-3.70362707];
    var zoom = 6;
    if ($scope.apartment.geoposition) {
        coords = $scope.apartment.geoposition.split(':')[0].split(',').map(function(a){return parseFloat(a);});
        zoom = parseInt($scope.apartment.geoposition.split(':')[1]);
    }

    var initMap = function() {
        var position = new google.maps.LatLng(coords[0], coords[1]);
        var mapOptions = {
            center: position,
            zoom: zoom,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        marker = new google.maps.Marker({
            map: map,
            position: position,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker, 'dragend', $scope.setCoords);
        google.maps.event.addListener(map, 'zoom_changed', function(){
            $scope.apartment.geoposition = $scope.apartment.geoposition.replace(/\:(.*)/, ':'+map.zoom);
            $scope.form.$setDirty();
            $scope.$apply();
        });
    };

    $scope.centerAndSetMarkerOnAddress = function() {
        // Se o usuario introduciu unha dirección na barra de busqueda,
        // buscamos esa dirección e se non, creamos a dirección a partir
        // dos datos do apartamento.
        var search_address = $scope.search_address;
        if ( ! search_address) {
            var country = $('#input-country option:selected').html();
            var province = $('#input-province option:selected').html();
            var town = $('#input-town option:selected').html();
            search_address = $scope.apartment.address+', '+town+', '+province+', '+country;
            $scope.search_address = search_address;
        }
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: search_address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(16);
                marker.setPosition(results[0].geometry.location);
                $scope.apartment.geoposition = results[0].geometry.location.toString().slice(1).slice(0, -1).replace(' ', '')+':'+map.zoom;
                $scope.form.$setDirty();
                $scope.$apply();
            }
        });
    };

    $scope.setCoords = function(ev) {
        var coords = ev.latLng.toString().slice(1).slice(0, -1).replace(' ', '')+':'+map.zoom;
        $scope.apartment.geoposition = coords;
        $scope.form.$setDirty();
        $scope.$apply();
    };

    initMap();
});

angular.module('adminApp').controller('ApartmentsApartmentsCtrl', function($rootScope, $scope, Apartment) {
    // Definimos a sección actual
    $rootScope.current_section = 'apartments';

    // Definimos o index do apartamento actual
    $scope.apartment_index = null;

    // Seteamos o bloque de apartamentos no scope
    $scope.apartment = Apartment;
    // E tamén os apartamentos do bloque de apartamentos
    $scope.apartments = Apartment.apartments || [];

    // Función para engadir un novo apartamento
    $scope.addApartment = function() {
        $scope.apartments.push({});
        $scope.apartment_index = $scope.apartments.length - 1;
    };
});