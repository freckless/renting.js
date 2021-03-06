// Router component
// ================
// Este component será o encargado de mostrar a información correspondente a cada consulta
// elexindo o controlador e a acción a utilizar ou mesmo facendo una redirección se é preciso.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    _ = require('lodash'),
    routes = require(config.paths.config + 'routes.js');

// Variables do módulo
var RouterComponent = {
    // Usaremos esta función para lanzar a carga das rutas existentes no arquivo de configuración routes.js
    // e crearemos un sistema dinámico para as direccións que non existan.
    init: function(app) {
        // Cargamos as rutas existentes na app
        this.loadRoutes(app);
        // No caso de que ningunha ruta sea válida, lanzarase un error 404.
        return function(req, res) {
            res.status(404);

            // Respondemos a consulta co erro 404 no formato indicado
            if (req.accepts('html')) {
                res.render('404.ejs', { url: req.url, layout: false });
                return;
            }

            if (req.accepts('json')) {
                res.send({ error: 'Not found' });
                return;
            }

            // Por defecto contestamos a consulta en texto plano
            res.type('txt').send('Not found');
        };
    },
    // Función para cargar as rutas da configuración na app
    loadRoutes: function(app) {
        // Exploramos os método declarados en cada ruta
        _.forEach(routes, function(methods, route) {
            var routeObject = app.route(route);
            // Cargamos cada acción no seu correspondente método e ruta.
            _.forEach(methods, function(raw_action, method) {
                if (typeof raw_action === 'string') {
                    // Recollemos as partes da acción sabendo que dase en formato controlador#acción
                    var parts = raw_action.split('#');
                    var controller = parts[0];
                    var action = 'action_' + parts[1];

                    // Se o controlador aínda non se cargóu, cargámolo
                    var ControllerClass = require(config.paths.controllers + controller + '.js');

                    // Engadimos a ruta a app
                    routeObject[method](function(req, res, next) {
                        // Definimos a acción que se está a executar
                        req.action = parts[1];
                        // Lanzamos a acción
                        ControllerClass.before(req, res, function() {
                            ControllerClass[action](req, res, function() {
                                ControllerClass.after(req, res, next);
                            });
                        });
                    });
                } else {
                    routeObject[method](raw_action);
                }
            });
        });
    }
};

module.exports = RouterComponent;