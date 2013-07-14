'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['./src/**/*.js', 'Gruntfile.js'],
      tasks: ['yuidoc', 'concat'],
      options: {
        interrupt: true,
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: ['./src/'],
          outdir: 'docs/'
        }
      }
    },

    concat: {
      dist: {
        src: [
            './vendor/jquery.js',
            './vendor/underscore.js',
            './vendor/backbone.js',
            './src/util/**/*.js',
            './src/mychat/model/**/*.js',
            './src/mychat/collection/**/*.js',
            './src/mychat/view/**/*.js',
            './src/mychat/*.js'
        ],
        dest: './dist/mychat.unpack.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-concat');

};
