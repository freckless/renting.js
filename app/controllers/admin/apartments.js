// #AdminApartmentsController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de apartamentos dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    Apartment = mongoose.model('Apartment'),
    Async = require('async');

// ##Accións do controlador
var AdminApartmentsController = new AdminControllerBase({
    action_upload: function(req, res) {
        // Dependencias da acción upload
        // -----------------------------
        var fs = require('fs'),
            path = require('path'),
            imagemagick = require('imagemagick');

        // Configuramos o directorio onde se gardarán as imaxes
        var images_path = config.paths.webroot+'img/apartments';

        // Función para gardar os arquivos
        var uploadFile = function(file, callback) {
            // Leemos o arquivo subido
            fs.readFile(file.path, function(err, data) {
                // Creamos un nome de arquivo que será único
                var d = new Date();
                var filename = (d.getTime()+'-'+Math.round(Math.random()*10000))+path.extname(file.name);
                // Creamos un arquivo coa imaxe orixinal
                fs.writeFile(path.join(images_path, 'original', filename), data, function() {
                    // Creamos unha imaxe de 1200 x 800
                    imagemagick.resize({
                        srcPath: path.join(images_path, 'original', filename),
                        dstPath: path.join(images_path, filename),
                        width: 1200,
                        height: 800
                    }, function() {
                        // E por último creamos unha miniatura de 320 x 210
                        imagemagick.crop({
                            srcPath: path.join(images_path, filename),
                            dstPath: path.join(images_path, 'thumb', filename),
                            width: 320,
                            height: 210
                        }, function() {
                            // E gardamos os datos do arquivo no array
                            callback(null, filename);
                        });
                    });
                });
            });
        };

        var files = req.files.image;

        // Comprobamos se solo está a subir un arquivo e se é así metémolo nun array
        if ( ! Array.isArray(files)) {
            files = [files];
        }

        // Gardamos os arquivos
        Async.map(files, uploadFile, function(err, uploaded_files) {
            res.json(uploaded_files);
        });
    }
});

// ##Facemos o controlador REST có modelo User
AdminApartmentsController = restComponent.call(AdminApartmentsController, Apartment, function(req, res, next) {
    if (req.action === 'find_all') {
        this.populate('country').populate('province').populate('town');
        next();
    } else {
        next();
    }
});

// ###Exportamos o modulo
module.exports = AdminApartmentsController;
