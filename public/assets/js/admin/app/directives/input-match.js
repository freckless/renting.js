'use strict';

angular.module('adminApp').directive('ngMatch', function() {
    return {
        require: 'ngModel',
        scope: {
            ngMatch: '='
        },
        link: function(scope, element, attrs) {
            scope.$parent.$watch(function() {
                console.log(scope.ngMatch);
            });
        }
    };
});