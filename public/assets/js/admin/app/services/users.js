'use strict';

angular.module('adminApp').factory('UserService', function($resource) {
    return $resource(
        '/admin/users/:id',
        {
            id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});