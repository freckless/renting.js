'use strict';

angular.module('adminApp').factory('UserService', function($resource) {
    return $resource(
        '/admin/users/:user_id',
        {
            user_id: '@_id'
        }, {
            update: { method: 'PUT' }
        }
    );
});