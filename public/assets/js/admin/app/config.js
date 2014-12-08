'use strict';

// #Configuración da app "adminApp"
angular.module('adminApp').config([
    '$locationProvider',
    '$routeProvider',
    '$translateProvider',
    function($locationProvider, $routeProvider, $translateProvider) {
        $translateProvider.useUrlLoader('/locale');

        $translateProvider.preferredLanguage('es');

        $locationProvider.hashPrefix('!');
        
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);

// #Configuramos a execución da app "adminApp"
angular.module('adminApp').run(['$rootScope', '$location', '$translate', '$locale',
    function($rootScope, $location, $translate, $locale) {
        $rootScope.$location = $location;
        $rootScope.$translate = $translate;
        $rootScope.$locale = $locale;
        $rootScope.$available_languages = ['es', 'en'];

        // Definimos eventos para saber dende as vistas se se están
        // a cargar datos, arquivos ou algunha ruta.
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.is_loading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.is_loading = false;
        });
    }
]);