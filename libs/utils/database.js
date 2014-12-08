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
            fields[language] = String
        });

        return fields;
    }
};

// Exportamos os axudantes creados
module.exports = DatabaseHelpers;