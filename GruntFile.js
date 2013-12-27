/* global module */

(function() {
    "use strict";

    module.exports = function(grunt) {
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-mocha-test');
        grunt.loadNpmTasks('grunt-jscoverage');
        grunt.loadNpmTasks('grunt-env');

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            env: {
                test: { NODE_ENV: 'test' },
                coverage: { NODE_ENV: 'coverage', REPERTOIRE_COV: 1 }
            },
            jshint: {
                options: {
                    strict: true,
                    devel: true,
                    ignores: ['lib/public/js/vendor/**/*.js']
                },
                all: ['GruntFile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js']
            },
            mochaTest: {
                test: {
                    options: {
                        ui: 'bdd',
                        reporter: 'spec'
                    },
                    src: ['test/**/*.js']
                },
                coverage: {
                    src: ['test/**/*.js'],
                    options: {
                        ui: 'bdd',
                        reporter: 'html-cov',
                        quiet: true,
                        coverage: true,
                        captureFile: 'coverage.html'
                    }
                }
            },
            jscoverage: {
                options: {
                    inputDirectory: 'lib',
                    outputDirectory: 'lib-cov',
                    highlight: true
                }
            }
        });

        grunt.registerTask('default', [ 'env:test', 'jshint', 'mochaTest:test' ]);
        grunt.registerTask('coverage', [ 'env:coverage', 'jscoverage', 'mochaTest:coverage' ]);

    };

}());