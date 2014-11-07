// #Helper para HTML

// Este helper será o encargado de facernos a vida máis doada á hora de
// crear as etiquetas HTML máis utilizadas

'use strict';

// ##Dependencias do módulo
var config = require(global.root_path + '/libs/config.js'),
    _ = require('lodash');

// ##Lóxica do helper
var helper = {
    // Creación de imaxes
    img: function(src, options) {
        options = _.assign({
            src: src
        }, options);
        return this.tag_builder('img', options);
    },
    // Creación de links
    anchor: function(link, inner, options) {
        options = _.assign({
            href: link
        }, options);
        return this.tag_builder('a', options, inner)
    },
    // Javascript
    js: function(files) {
        if (typeof(files) == 'string') files = [files];
        var code = '';
        for (var x = 0; x < files.length; x++) {
            var options = {
                type: 'text/javascript',
                src: files[x]
            };
            code += this.tag_builder('script', options, '');
        }
        return code;
    },
    // Stylesheets
    css: function(files) {
        if (typeof(files) == 'string') files = [files];
        var code = '';
        for (var x = 0; x < files.length; x++) {
            var options = {
                rel: 'stylesheet',
                type: 'text/css',
                href: files[x]
            };
            code += this.tag_builder('link', options);
        }
        return code;
    },
    // Creación xeral de etiquetas
    tag_builder: function(tag, params, inner) {
        var code = '<'+tag;
        for (var key in params) {
            var value = params[key];
            code += ' '+key+'="'+value+'"';
        }
        if (typeof(inner) !== 'undefined') {
            code += '>'+inner+'</'+tag+'>';
        } else {
            code += ' />';
        }

        return code;
    }
};

module.exports = helper;