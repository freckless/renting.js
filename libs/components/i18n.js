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
  load: function() {
    // Cargamos as traduccións (só se cargará unha vez cada arquivo xa que "require" gardao na memoria)
    this.translations = require(config.paths.lang + '/' + this.language + '.js');
  },
  detect: function() {    
    if (this.request.cookies.language) {
      // Detectamos se o usuario ten unha cookie co idioma
      this.language = this.request.cookies.language;
    } else {
      // Se non a ten obtemos o idioma do navegador e se este non é válido usamos o idioma por defecto
      this.language = config.app.default_language;

      if (this.request.headers['accept-language']) {
        var lang = this.request.headers['accept-language'].slice(0, 2).toLowerCase();
        if (config.app.languages.indexOf(lang) > -1) {
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
      if (config.app.languages.indexOf(language) > -1) {
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
    if (i18n.translations[string]) {
      string = i18n.translations[string];
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