'use strict';

// #Configuración da app "adminApp"
angular.module('adminApp').config([
    '$locationProvider',
    '$routeProvider',
    '$translateProvider',
    function($locationProvider, $routeProvider, $translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: '/assets/js/admin/i18n/',
            suffix: '.json'
        });

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
    }
]);