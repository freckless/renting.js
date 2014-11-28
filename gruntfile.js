'use strict';

module.exports = function(grunt) {
    // Cargamos as dependencias das tarefas
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Configuramos as tarefas
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['public/assets/css/**/*.sass'],
                tasks: ['sass:dev']
            },
            views: {
                files: ['app/views/**/*.ejs'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                files: [
                    'public/assets/css/*.css',
                    'public/assets/js/**/*.js'
                ],
                options: {
                    livereload: true
                }
            },
            apps: {
                files: 'public/apps/**/*.js',
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            }
        },
        uglify: {
            admin_app: {
                files: {
                    'public/apps/admin/app.js': [
                        'public/apps/admin/app/app.js',
                        'public/apps/admin/app/config.js',
                        'public/apps/admin/app/directives/*.js',
                        'public/apps/admin/app/services/*.js',
                        'public/apps/admin/app/controllers/*.js'
                    ]
                }
            }
        },
        sass: {
            dev: {
                options: {
                    cacheLocation: 'tmp/sass-cache'
                },
                files: {
                    'public/assets/css/website.css': 'public/assets/css/website.sass',
                    'public/assets/css/admin.css': 'public/assets/css/admin.sass',
                    'public/assets/css/icons.css': 'public/assets/css/resources/icons.sass'
                }
            }
        }
    });

    // Rexistramos as tarefas a executar
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('console', 'Launch a console', function() {
        var done = this.async();

        var repl = require('repl');
        var shell = repl.start({
            prompt: 'renting.js > ',
            useColors: true
        });
        process.console = true;
        require('./server.js');

        shell.on('exit', done);
    });
};