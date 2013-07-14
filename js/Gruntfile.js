/*
 * grunt-bull-template
 * https://github.com/tan-yuki/grunt-bull-template
 *
 * Copyright (c) 2013 tan-yuki
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['app.js'],
      tasks: ['yuidoc'],
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
          paths: ['.'],
          outdir: 'docs/'
        }
      }
    }
  });

  // Actually load this plugin's task(s).
//  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

};
