// #Helper para os Assets

// Este helper axudaranos a incluir os recursos como imaxes, scripts
// e follas de estilo da carpeta assets so indicando o seu nome

'use strict';

// ##Dependencias do módulo
var config = global.config,
    _ = require('lodash'),
    html = require(config.paths.helpers + 'html.js');

// ##Lóxica do helper
var helper = {
    // Creación de imaxes
    img: function() {
        return html.img('/assets/img/' + arguments[0], arguments[1] || {});
    },
    // Javascript
    js: function() {
        var files = [];
        _.forEach(arguments, function(file, index) {
            files[index] = '/assets/js/' + file;
        });

        return html.js.apply(null, files);
    },
    // Stylesheets
    css: function() {
        var files = [];
        _.forEach(arguments, function(file, index) {
            files[index] = '/assets/css/' + file;
        });

        return html.css.apply(null, files);
    },
    // SVG Icons
    icon: function(symbol, file, classes) {
        var extra_css = '';
        if (typeof classes !== 'undefined') {
            if (typeof classes === 'string') {
                extra_css = ' '+classes;
            } else {
                extra_css = ' '+classes.join(' ');
            }
        }

        var html = '<svg class="icon'+extra_css+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
                   '<use xlink:href="/assets/img/'+file+'#'+symbol+'"></use>'+
                   '</svg>';
        return html;
    }
};

module.exports = helper;