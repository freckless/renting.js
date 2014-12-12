'use strict';

angular.module('adminApp').factory('$flash', function($rootScope) {
    var queue = [];

    var show = function() {
        if (queue.length > 0) {
            $rootScope.flash_message = queue[0];
            queue.shift();
        } else {
            $rootScope.flash_message = null;
        }
    };

    $rootScope.$on('$routeChangeSuccess', function() {
        show();
    });

    return {
        show: function() {
            show();
        },
        set: function(type, message) {
            queue.push({
                type: type,
                message: message
            });
        }
    };
});