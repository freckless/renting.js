// #i18n Component

// Este compoñente será o encargado de xestionar as traduccións do portal
'use strict';

// ##Dependencias do módulo
var config = global.config,
    _ = require('lodash');

// #Lóxica do compoñente
// Iniciamos a "clase"
var i18nComponent = function(req, res, next) {
  this.init(req, res, next);
  return this;
};

// Definimos as varibles e mailos métodos
i18nComponent.prototype = {
  request: null, // Gardaremos a consulta
  response: null, // A resposta
  language: null, // A lingua en uso
  fallback: null, // A lingua en caso de faltar unha traducción
  translations: {}, // As traduccións
  init: function(req, res, next) {
    // Gardamos os datos da consulta e da resposta
    this.request = req;
    this.response = res;

    // Comprobamos se se esta a cambiar a lingua
    if ( ! this.change_language()) {
      // Se non se está a cambiar, detectamos a lingua que se vai a usar
      this.detect();

      // Cargamos as traduccións
      this.load();

      // Gardamos o obxeto no ámbito global para acceden dende calque lado
      global.i18n = this;

      // Tamén nos locals por se se necesita acceder
      res.locals.i18n = global.i18n;

      // Creamos un alias nos "locals" o que nomeamos "_" para traduccir dende as vistas
      res.locals._ = global.i18n.translate;

      // Continuamos coa execución de middlewares
      next();
    }
  },
  load: function(file) {
    // Se se pasa o arquivo como parámetro tan so cargamos ese arquivo
    if (typeof(file) !== 'undefined') {
        this.translations[file] = require(config.paths.lang + this.language + '/'+ file + '.js');
    } else {
        // Cargamos as traduccións configuradas na app como "autoload" se non se indica o ficheiro
        var files = config.app.language.autoload;
        for (var x = 0; x < files.length; x++) {
            file = files[x];
            this.translations[file] = require(config.paths.lang + this.language + '/'+ file + '.js');
        }
    }
  },
  detect: function() {
    this.fallback = config.app.language.fallback;
    if (this.request.cookies.language) {
      // Detectamos se o usuario ten unha cookie co idioma
      this.language = this.request.cookies.language;
    } else {
      // Se non a ten obtemos o idioma do navegador e se este non é válido usamos o idioma por defecto
      this.language = config.app.language.default;

      if (this.request.headers['accept-language']) {
        var lang = this.request.headers['accept-language'].slice(0, 2).toLowerCase();
        if (config.app.language.available.indexOf(lang) > -1) {
          this.language = lang;
        }
      }
    }
    // Gardamos o idioma nunha cookie para non detectalo nas proximas entradas (Unha semana dende a última visita)
    this.response.cookie('language', this.language, { maxAge: 604800000 });
  },
  change_language: function() {
    // Detectamos se se está intentando facer un cambio de idioma e se é así facémolo e redireccionamos
    // a última páxina vista ou a home
    if (this.request.path.match('^/language/')) {
      var language = this.request.path.replace('/language/', '');
      if (config.app.language.available.indexOf(language) > -1) {
        this.response.cookie('language', language, { maxAge: 604800000 });
        this.response.redirect(this.request.headers.referer || '/');
        return true;
      }
    }
  },
  // Función para traducir os textos
  // Pódense indicar variables que serán subsituidas polo seu valor na traducción (decláranse engadindo : o principio)
  translate: function(string, vars) {
    var i18n = global.i18n;

    // Comprobamos se existen traduccións para a cadea
    var translation = i18n.translations;

    // Partimos a cadea polos puntos para detectar o obxecto que garda a tradución
    var parts = [];
    var str = string;
    while (str.indexOf('.') > -1) {
        parts = str.split('.');
        str = parts.splice(1, 1).join('.');
        translation = translation[parts[0]];
        if (typeof(translation) === 'undefined') {
            return string;
        }
    }

    if (typeof(translation[str]) !== 'undefined') {
      string = translation[str];
      // Comprobamos se existen variables
      if (vars) {
        // Substituimos cada unha de elas polo seu valor
        _.each(vars, function(value, key) {
          var regexp = new RegExp(':'+key, 'g');
          string = string.replace(regexp, value);
        });
      }
    }

    // Devolvemos a cadena traducida se foi posible ou senon a orixinal
    return string;
  }
};

// Exportamos o compoñente
module.exports = {
  init: function() {
    // Esta función simplemente inicia o compoñente para cada consulta
    return function(req, res, next) {
      global.i18n = new i18nComponent(req, res, next);
    };
  }
};