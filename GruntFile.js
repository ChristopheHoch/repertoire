/* global module */

module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-cov');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-env');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        jshint: {
            options: {
                strict: true,
                devel: true,
                ignores: ['src/public/lib/**/*.js']
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
        mochacov: {
            coverage: {
                options: {
                    coveralls: {
                        serviceName: 'travis-ci',
                        repoToken: 'w3eqkp7Nd0B3Vo59U04t2JXf5tNKpyboi'
                    }
                }
            },
            options: {
                files: 'test/**/*.js'
            }
        },
        plato: {
            test: {
                options: {
                    exclude: /\.json$|src\/public\/lib|report/
                },
                files: {
                    'report': ['src/**/*.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['env:test', 'jshint', 'plato:test', 'mochaTest', 'mochacov:coverage']);
    grunt.registerTask('test', ['env:test', 'jshint', 'plato:test', 'mochaTest']);

};
