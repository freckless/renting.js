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
    img: function(src, options) {
        return html.img('/assets/img/' + src, options);
    },
    // Javascript
    js: function(files) {
        if (typeof(files) === 'string') files = [files];
        _.forEach(files, function(v, index) {
            files[index] = '/assets/js/' + files[index];
        });

        return html.js(files);
    },
    // Stylesheets
    css: function(files) {
        if (typeof(files) === 'string') files = [files];
        _.forEach(files, function(v, index) {
            files[index] = '/assets/css/' + files[index];
        });

        return html.css(files);
    },
    // SVG Icons
    icon: function(symbol, file, extra_css) {
        if (typeof(extra_css) === 'undefined') extra_css = [];
        var html = '<svg xlink:href="'+file+'#'+symbol+'" class="icon '+extra_css.join(' ')+'">';
        return html;
    }
};

module.exports = helper;