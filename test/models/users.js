// Auth test
// =========

'use strict';

// Configuramos o entorno a "testing"
process.env.NODE_ENV = 'testing';

// Lanzamos a app
require('../../server.js');

// Dependencias do modulo
// ----------------------
var mongoose = require('mongoose'),
    assert = require('assert'),
    _ = require('lodash'),
    User = mongoose.model('User');


// Creamos un obxeto cos datos do usuario de proba
var user_data = {
    'username': 'test_data',
    'mail': 'test_data',
    'password': 'test_password',
    'firstname': 'test_data',
    'lastname': 'test_data',
    'phone': 'test_data',
    'city': 'test_data',
    'zipcode': 'test_data',
    'address': 'test_data',
    'company': 'test_data',
    'born_at': new Date(),
    'sex': 0,
    'picture': 'test_data',
    'document': {
        type: 'test_data',
        number: 'test_data'
    },
    'newsletter': true
};

// Clear collections
before(function(done) {
    var callback = function(){};
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(callback);
    }
    return done();
});

describe('Usuarios', function() {
    describe('Creacion', function() {
        it('Un usuario non pode ser creado se falla unha das validacións (required)', function(done) {
            var user = new User(user_data);
            user.username = null;
            user.save(function(err) {
                if (err) {
                    done();
                } else {
                    throw new Error('O usuario creouse sen cumprir as validacións');
                }
            });
        });
        it('Un usuario deberia de ser creado se se cumpren todas as validacións', function(done) {
            var user = new User(_.cloneDeep(user_data));
            user.save(function(err) {
                if (err) {
                    throw new Error('O usuario non se puido crear');
                } else {
                    done();
                }
            });
        });
        it('Un usuario non pode ser creado se existe un có mesmo username', function(done) {
            var user = new User(_.cloneDeep(user_data));
            user.mail = 'other_mail';
            user.save(function(err) {
                if (err) {
                    done();
                } else {
                    throw new Error('O usuario creuse sen problemas');
                }
            });
        });
        it('Un usuario non pode ser creado se existe un có mesmo mail', function(done) {
            var user = new User(_.cloneDeep(user_data));
            user.mail = 'other_username';
            user.save(function(err) {
                if (err) {
                    done();
                } else {
                    throw new Error('O usuario creuse sen problemas');
                }
            });
        });
    });
    describe('Autenticación', function() {
        it('Autenticación con credenciais incorrectas debe de devolver false', function(done) {
            User.findOne({username: user_data.username}, function(err, user) {
                if (err)
                    throw err;
                assert.equal(user.authenticate('bad_password'), false, 'Autenticado con datos incorrectos');
                done();
            });
        });
        it('Autenticación con credenciais correctas debe de devolver true', function(done) {
            User.findOne({username: user_data.username}, function(err, user) {
                if (err)
                    throw err;
                assert.equal(user.authenticate(user_data.password), true, 'Autenticado con datos incorrectos');
                done();
            });
        });
    });
});

