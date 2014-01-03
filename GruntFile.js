/* global module */

(function() {
    "use strict";

    module.exports = function(grunt) {
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-mocha-test');
        grunt.loadNpmTasks('grunt-plato');
        grunt.loadNpmTasks('grunt-env');

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            env: {
                test: { NODE_ENV: 'test' }
            },
            jshint: {
                options: {
                    strict: true,
                    devel: true,
                    ignores: ['src/public/js/vendor/**/*.js']
                },
                all: ['GruntFile.js', 'blanket.js', 'src/**/*.js', 'test/**/*.js']
            },
            mochaTest: {
                test: {
                    options: {
                        ui: 'bdd',
                        reporter: 'spec',
                        require: 'blanket'
                    },
                    src: ['test/**/*.js']
                },
                'html-cov': {
                    options: {
                        reporter: 'html-cov',
                        quiet: true,
                        captureFile: 'coverage.html'
                    },
                    src: ['test/**/*.js']
                },
                'travis-cov': {
                    options: {
                        reporter: 'travis-cov'
                    },
                    src: ['test/**/*.js']
                }

            },
            plato: {
                test: {
                    options: {
                        exclude: /\.json$|src\/public\/js\/vendor/
                    },
                    files: {
                        'report': ['src/**/*.js']
                    }
                }
            }
        });

        grunt.registerTask('default', [ 'env:test', 'jshint', 'plato:test', 'mochaTest' ]);

    };

}());