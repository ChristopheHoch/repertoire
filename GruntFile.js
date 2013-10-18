/* global module */

(function() {
   "use strict";

   module.exports = function(grunt) {
      grunt.loadNpmTasks('grunt-contrib-jshint');
      grunt.loadNpmTasks('grunt-mocha-test');
      grunt.registerTask('default', ['jshint', 'mochaTest']);
      grunt.initConfig({
         pkg: grunt.file.readJSON('package.json'),
         jshint: {
            options: {
               strict: true,
               devel: true,
               ignores: ['src/public/js/vendor/*.js']
            },
            all: ['GruntFile.js', 'src/**/*.js', 'test/**/*.js']
         },
         mochaTest: {
            options: {
               reporter: 'spec'
            },
            src: ['test/**/*.js']
         }
      });
   };
   
}());