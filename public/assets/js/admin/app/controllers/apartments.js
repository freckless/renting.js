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
                        return ApartmentService.get({id: $route.current.params.id}).$promise;
                    }
                }
            }).
            when('/apartments/images/:id', {
                templateUrl: 'assets/js/admin/views/apartments/images.html',
                controller: 'ApartmentsImagesCtrl',
                resolve: {
                    Apartment: function(ApartmentService, $route) {
                        return ApartmentService.get({id: $route.current.params.id}).$promise;
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

angular.module('adminApp').controller('ApartmentsApartmentsCtrl', function($rootScope, $timeout, $filter, $flash, $location, $scope, Apartment, ApartmentService) {
    // Definimos a sección actual
    $rootScope.current_section = 'apartments';

    // Definimos a variable hasChanges para notificar a vista cando hay cambios.
    $scope.hasChanges = false;

    // Definimos o index do apartamento actual
    $scope.apartment_index = null;
    $scope.apartment = null;

    // Definimos o bloque de apartamentos
    $scope.apartment_block = Apartment;

    // E tamén os apartamentos do bloque de apartamentos
    $scope.apartments = Apartment.apartments || [];

    // Función para gardar o bloque de apartamentos na base de datos
    $scope.saveApartmentsBlock = function() {
        // Cargamos o bloque de apartamentos de novo por se sufriu algún cambio exterior
        ApartmentService.get({id: Apartment._id}).$promise.then(function(Apartment) {
            Apartment.apartments = $scope.apartments;
            /*Apartment.$update(function() {
                $flash.set('success', 'admin.changes_has_been_saved');
                $location.path('/apartments');
            })*/
        });
    };

    // Función para engadir un novo apartamento
    $scope.addApartment = function() {
        $scope.apartment = {
            seasons:[],
            closed:[]
        };
    };

    // Función para cancelar a creación / edición dun apartamento
    $scope.cancelApartment = function() {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.apartment = $scope.apartment_index = null;
        }
    };

    // Función para gardar o apartamento
    $scope.saveApartment = function() {
        if ($scope.apartment_index !== null) {
            $scope.apartments[$scope.apartment_index] = angular.copy($scope.apartment);
        } else {
            $scope.apartments.push(angular.copy($scope.apartment));
        }
        $scope.apartment = $scope.apartment_index = null;
        $scope.apartmentForm.$setPristine();
        $scope.hasChanges = true;
    };

    // Función para editar un apartamento
    $scope.editApartment = function($index) {
        $scope.apartment = angular.copy($scope.apartments[$index]);
        $scope.apartment_index = $index;
    };

    // Función para eliminar un apartamento
    $scope.deleteApartment = function() {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.apartments.splice($scope.apartment_index, 1);
            $scope.apartment = $scope.apartment_index = null;
        }
    };

    // Función para duplicar un apartamento (moi util para as tarifas)
    $scope.duplicateApartment = function() {
        var apartment = angular.copy($scope.apartment);
        $scope.apartment_index = null;
        $scope.apartment = null;
        $timeout(function(){
            $scope.apartment = apartment;
            $scope.$apply();
        }, 100);
    };


    // Definimos que non se está a engadir ningunha data de peche ou ningunha tarifa
    $scope.season_index = $scope.closed_index = null;
    $scope.season = $scope.closed = null;

    // Engadimos unha nova tarifa
    $scope.addSeason = function() {
        $scope.season = {};
    };

    // Cancelamos a creación / edición dunha temporada
    $scope.cancelSeason = function() {
        $scope.season = null;
        $scope.season_index = null;
    };

    // Gardar os datos da temporada no apartamento
    $scope.saveSeason = function() {
        if ($scope.season_index !== null) {
            $scope.apartment.seasons[$scope.season_index] = angular.copy($scope.season);
        } else {
            $scope.apartment.seasons.push($scope.season);
        }
        $scope.season = $scope.season_index = null;
        $scope.apartmentForm.$setDirty();
    };

    // Editamos unha temporada
    $scope.editSeason = function($index) {
        $scope.season_index = $index;
        $scope.season = {};
        $scope.season = angular.copy($scope.apartment.seasons[$index]);
        $scope.renderSeasonDates();
    };

    // Eliminar unha temporada existente
    $scope.deleteSeason = function($index) {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.apartment.seasons.splice($index, 1);
        }
    };

    // Engadimos unha nova data de peche
    $scope.addClosed = function() {
        $scope.closed = {};
    };

    // Cancelamos a creación / edición dunha data de peche
    $scope.cancelClosed = function() {
        $scope.closed = null;
        $scope.closed_index = null;
    };

    // Gardar os datos da temporada de peche no apartamento
    $scope.saveClosed = function() {
        if ($scope.closed_index !== null) {
            $scope.apartment.closed[$scope.closed_index] = angular.copy($scope.closed);
        } else {
            $scope.apartment.closed.push($scope.closed);
        }
        $scope.closed = $scope.closed_index = null;
        $scope.apartmentForm.$setDirty();
    };

    // Editamos unha data de peche
    $scope.editClosed = function($index) {
        $scope.closed_index = $index;
        $scope.closed = {};
        $scope.closed = angular.copy($scope.apartment.closed[$index]);
        $scope.renderClosedDates();
    };

    // Eliminar unha data de peche existente
    $scope.deleteClosed = function($index) {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.apartment.closed.splice($index, 1);
        }
    };

    // Datepicker
    $scope.dateOptions = {
        startingDay: 1,
        showWeeks: false,
        showButtonBar: false
    };

    // Fix para o render das datas a hora de editar as temporadas
    $scope.renderSeasonDates = function() {
        angular.element($('#input-season-from')).controller('ngModel').$setViewValue(new Date($scope.season.from));
        angular.element($('#input-season-from')).controller('ngModel').$render();
        angular.element($('#input-season-to')).controller('ngModel').$setViewValue(new Date($scope.season.to));
        angular.element($('#input-season-to')).controller('ngModel').$render();
    };

    // Fix para o render das datas a hora de editar as datas de peche
    $scope.renderClosedDates = function() {
        angular.element($('#input-closed-from')).controller('ngModel').$setViewValue(new Date($scope.closed.from));
        angular.element($('#input-closed-from')).controller('ngModel').$render();
        angular.element($('#input-closed-to')).controller('ngModel').$setViewValue(new Date($scope.closed.to));
        angular.element($('#input-closed-to')).controller('ngModel').$render();
    };

    // Cancelamos a acción e voltamos atrás sen gardar ningún cambio
    $scope.cancel = function() {
        // Se o formulario foi modificado preguntamos ó
        // usuario se está seguro de cancelar.
        if ($scope.hasChanges) {
            if ( ! confirm($filter('translate')('admin.are_you_sure'))) {
                return false;
            }
        }
        window.history.back();
    };
});

angular.module('adminApp').controller('ApartmentsImagesCtrl', function($rootScope, $scope, $filter, $flash, $location, Apartment, ApartmentService) {
    // Definimos a sección actual
    $rootScope.current_section = 'apartments';

    // Definimos o apartamento e as imaxes
    $scope.apartment = Apartment;
    $scope.images = Apartment.images || [];
    $scope.uploading = [];

    $scope.uploadStart = function(files) {
        $scope.uploading.push(files);
    };

    $scope.deleteImage = function($index) {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.images.splice($index, 1);
        }
    };

    $scope.uploadComplete = function(response) {
        var images = [];
        $.each(response.data, function(index, item) {
            images.push({
                file: item
            });
        });
        $scope.images = $scope.images.concat(images);
    };
});