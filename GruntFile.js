/* global module */

(function() {
   "use strict";

   module.exports = function(grunt) {
      grunt.loadNpmTasks('grunt-contrib-jshint');
      grunt.registerTask('default', ['jshint']);
      grunt.initConfig({
         pkg: grunt.file.readJSON('package.json'),
         jshint: {
            options: {
               strict: true,
               devel: true
            },
            all: ['GruntFile.js', 'src/*.js', 'test/*.js']
         }
      });
   };
   
}());