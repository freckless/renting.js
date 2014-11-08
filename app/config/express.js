// #Módulo de configuración de express

// Neste arquivo ocuparémonos de configurar o framework express
// para que funcione o noso gusto.

'use strict';

// ##Dependencias do módulo
var config = require(global.root_path + '/app/config/loader.js'),
    partials = require('express-partials'),
    multiparty = require('connect-multiparty'),
    compression = require('compression'),
    morgan = require('morgan'),
    body_parser = require('body-parser'),
    method_override = require('method-override'),
    cookie_parser = require('cookie-parser'),
    cookie_session = require('cookie-session'),
    helpers = require(config.paths.helpers + '/loader.js'),
    auth = require(config.paths.components + '/auth.js'),
    router = require(config.paths.components + '/router.js'),
    serve_static = require('serve-static'),
    serve_favicon = require('serve-favicon');

// ##Configuración
module.exports = function(app) {
    // Configuramos o servidor para que mostre o stack en caso de error
    app.set('showStackError', true);

    // Configuramos o porto
    app.set('port', config.port);

    // Prettify HTML.
    app.locals.pretty = true;

    // Usaremos partials para poder utilizar plantillas parciales.
    app.use(partials());

    // Configuramos express para que comprima os arquivos antes
    // de envialos ó cliente.
    app.use(compression({
        // Filtramos só os arquivos que queremos que se compriman.
        filter: function() {
            return (/json|text|javascript|css/).text;
        },
        // Sinalamos o nivel de comprensión que se aplicará ó recursos
        // do 0 o 10, de menor a maior.
        level: 9
    }));

    // Se estamos en entorno de desenrolo activamos o logger para ver
    // as consultas que se fan en cada momento.
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Configuramos o directorio das vistas e o motor de plantilla que vamos a utilizar.
    app.set('views', config.paths.root + '/app/views');
    app.engine('ejs', require('ejs').renderFile);

    // ##Configuramos os middlewares dos que vai a facer uso o servidor.
    // CookieParser para manexar as cookies dunha forma máis sinxela.
    app.use(cookie_parser());

    // Os encargados de recoller información enviada mediante POST, PUT...
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({extended: false}));

    // Activamos a opción de recoller arquivos enviados dende formularios
    // é decir datos enviados mediante enctype multipart/form-data.
    app.use(multiparty());

    // MethodOverride é realmente útil para enviar datos mediante métodos non soportados
    // polo navegador como PUT, DELETE... simplemente engadindo ?_method=PUT a URL.
    app.use(method_override());

    // Activamos o almacenamento de sesions na base de datos.
    app.use(cookie_session({
        secret: config.sessions.secret,
        name: config.sessions.name
    }));

    // Engadimos a consulta á resposta para poder acceder a ela dende as vistas ou controladores.
    app.use(function(req, res, next) {
        res.locals.req = req;
        next();
    });

    // Helpers, os axudantes que utilizaremos para a xeneración de vistas e máis cousas.
    app.use(helpers());

    // Sistema de autenticación de usuarios
    app.use(auth.init());

    // Buscamos recursos státicos que podan responder a consulta.
    app.use(serve_favicon(config.paths.webroot + '/favicon.ico'));
    app.use(serve_static(config.paths.webroot));

    // No caso de que non existan, lanzamos o enrutador para redireccionar cada consulta o controlador correspondente
    app.use(router.init(app));
};