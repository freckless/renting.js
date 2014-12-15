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
                    }
                }
            }).
            when('/bookings/details/:id', {
                templateUrl: 'assets/js/admin/views/bookings/details.html',
                controller: 'BookingsDetailsCtrl',
                resolve: {
                    Booking: function(BookingService, $route) {
                        console.log($route);
                        return BookingService.get({id: $route.current.params.id}).$promise;
                    }
                }
            });
    }
]);

// ##Controladores
// Creamos os controladores necesarios para manexar as vistas

// ###Controlador da páxina inicial
// Controlador encargado de mostrar a páxina inicial
angular.module('adminApp').controller('BookingsIndexCtrl', function($rootScope, $scope, $flash, $filter, Apartments) {
    $rootScope.current_section = 'bookings';

    $scope.apartments = Apartments;

    $scope.confirmBooking = function($apartment, $index) {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.apartments[$apartment].bookings[$index].confirmed = true;
            $scope.apartments[$apartment].bookings[$index].$update(function() {
                $flash.set('success', 'admin.changes_has_been_saved');
                $flash.show();
            });
        }
    }

    $scope.deleteBooking = function($apartment, $index) {
        if (confirm($filter('translate')('admin.are_you_sure'))) {
            $scope.apartments[$apartment].bookings[$index].$delete(function() {
                $flash.set('success', 'admin.object_has_been_removed');
                $flash.show();
                $scope.apartments[$apartment].bookings.splice($index, 1);
                if ($scope.apartments[$apartment].bookings.length < 1) {
                    $scope.apartments.splice($apartment, 1);
                }
            });
        }
    }
});

// ###Controlador da páxina de details
// Controlador encargado de mostrar os detalles da reserva
angular.module('adminApp').controller('BookingsDetailsCtrl', function($rootScope, $scope, Booking) {
    $rootScope.current_section = 'bookings';
    $scope.action = 'details';
    $scope.booking = Booking;
});