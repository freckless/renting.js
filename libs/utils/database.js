// Database Helpers
// ================
// Neste arquivo crearemos funcións útiles que nos van
// a axudar a manexar datos dos modelos, etc...

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    mongoose = require('mongoose'),
    _ = require('lodash');

// Utilidades
// ----------
var DatabaseHelpers = {
    validate_uniqueness: function(model, field, value, callback) {
        var Model = mongoose.model(model);

        var query = {
            '_id': { '$ne': this._id }
        };
        query[field] = value;
        
        Model.findOne(query, function(err, data) {
            if (err) {
                throw err;
            } else {
                if (data) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        });
    },
    localized_field: function() {
        var fields = {};
        _.each(config.app.language.available, function(language) {
            fields[language] = String;
        });

        return fields;
    },
    get_valid_url: function(model_name, url_field, value_field, callback) {
        var self = this;
        var index = 0;
        var model = mongoose.model(model_name);
        var url = this[value_field].replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
        var query = {
            _id: {$ne: this._id}
        };

        var check_unique = function() {
            query[url_field] = url+(index > 0 ? '-'+index : '');
            model.find(query).exec(function(err, data) {
                if (err) { console.log(err); }
                if (data.length > 0) {
                    index++;
                    check_unique();
                } else {
                    self[url_field] = query[url_field];
                    callback.apply(self);
                }
            });
        };

        check_unique();
    }
};

// Exportamos os axudantes creados
module.exports = DatabaseHelpers;