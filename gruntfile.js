'use strict';

module.exports = function(grunt) {
    // Cargamos as dependencias das tarefas
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
            }
        },
        sass: {
            dev: {
                options: {
                    cacheLocation: 'tmp/sass-cache'
                },
                files: {
                    'public/assets/css/website.css': 'public/assets/css/website.sass',
                    'public/assets/css/backend.css': 'public/assets/css/backend.sass'
                }
            }
        }
    });

    // Rexistramos as tarefas a executar
    grunt.registerTask('default', ['watch']);
};