// Database Helpers
// ================
// Neste arquivo crearemos funcións útiles que nos van
// a axudar a manexar datos dos modelos, etc...

'use strict';

// Dependencias do módulo
// ----------------------
var mongoose = require('mongoose');

// Utilidades
// ----------
var DatabaseHelpers = {
    validate_uniqueness: function(model, field, value, callback) {
        var Model = mongoose.model(model);

        var query = {};
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
    }
};

// Exportamos os axudantes creados
module.exports = DatabaseHelpers;