'use strict';

angular.module('adminApp').directive('backButton', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.addClass('back-button')
            element.bind('click', function() {
                window.history.back();
            });
        }
    };
});