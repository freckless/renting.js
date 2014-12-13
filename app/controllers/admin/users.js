// #AdminUsersController
// Controlador que utilizaremos como API para a creción, modificación
// e borrado de usuarios dende o panel de xestión.

'use strict';

// Dependencias do módulo
// ----------------------
var config = global.config,
    AdminControllerBase = require(config.paths.controllers + 'admin/base.js'),
    restComponent = require(config.paths.components + 'rest.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

// ##Accións do controlador
var AdminUsersController = new AdminControllerBase({
    action_upload: function(req, res) {
        // Dependencias da acción upload
        // -----------------------------
        var fs = require('fs'),
            path = require('path'),
            imagemagick = require('imagemagick');

        // Configuramos o directorio onde se gardarán as imaxes
        var images_path = config.paths.webroot+'img/profiles';

        var file = req.files.image;

        // Leemos o arquivo subido
        fs.readFile(file.path, function(err, data) {
            // Creamos un nome de arquivo que será único
            var d = new Date();
            var filename = (d.getTime()+'-'+Math.round(Math.random()*10000))+path.extname(file.name);
            // Creamos un arquivo coa imaxe orixinal
            fs.writeFile(path.join(images_path, 'original', filename), data, function(err) {
                // Creamos unha imaxe de 256 x 256
                imagemagick.crop({
                    srcPath: path.join(images_path, 'original', filename),
                    dstPath: path.join(images_path, filename),
                    width: 256,
                    height: 256
                }, function() {
                    res.send(filename);
                });
            });
        });
    }
});

// ##Facemos o controlador REST có modelo User
AdminUsersController = restComponent.call(AdminUsersController, User, function(req, res, next) {
    // Eliminamos do resultado a clave salt así como o password
    this.select({'salt': false, 'hashed_password': false, 'token': false});

    // Se a búsqueda ten un grupo, añadimolo á consulta
    if (req.query.group) {
        this.where('group', req.query.group);
    }

    // Se non é administrador so lle deixamos acceder o seu perfil
    if (res.locals.user.group > 2) {
        this.where('_id', res.locals.user._id);
        next();
    } else {
        next();
    }
});

// ###Exportamos o modulo
module.exports = AdminUsersController;
