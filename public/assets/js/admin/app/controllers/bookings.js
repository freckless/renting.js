// BookingsController
// ====================
// Este controlador é o encargado de mostrar o listado das reservas
// que se han realizado en cada un dos apartamentos do usuario e
// xestionalas (confirmar, cancelar...)

'use strict';

// Rutas
// -----
// Definimos as rutas para o controlador
angular.module('adminApp').config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/bookings', {
                templateUrl: 'assets/js/admin/views/bookings/index.html',
                controller: 'BookingsIndexCtrl',
                resolve: {
                    Apartments: function($q, ApartmentService, BookingService) {
                        var apartmentsDeferred = $q.defer();
                        var bookingsDeferred = $q.defer();

                        ApartmentService.query(function(apartments) {
                            apartmentsDeferred.resolve(apartments)
                        });

                        var resolvedApartments = 0;
                        var apartmentsWithBookings = [];
                        apartmentsDeferred.promise.then(function(apartments) {
                            angular.forEach(apartments, function(apartment, key) {
                                BookingService.query({apartment_block: apartment._id}, function(bookings) {
                                    if (bookings.length > 0) {
                                        apartment.bookings = bookings;
                                        apartmentsWithBookings.push(apartment);
                                    }
                                    if (++resolvedApartments == apartments.length) {
                                        bookingsDeferred.resolve(apartmentsWithBookings);
                                    }
                                })
                            });
                        });

                        return bookingsDeferred.promise;
                    },
                    Countries: function(CountryService) {
                        return CountryService.query().$promise;
                    }
                }
            });
    }
]);

// ##Controladores
// Creamos os controladores necesarios para manexar as vistas

// ###Controlador da páxina inicial
// Controlador encargado de mostrar a páxina inicial
angular.module('adminApp').controller('BookingsIndexCtrl', function($rootScope, $scope, Apartments) {
    $rootScope.current_section = 'bookings';

    $scope.apartments = Apartments;

    $scope.justWithBookings = function(apartment) {
        return apartment.bookings ? true : false;
    };
});