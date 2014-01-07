/* global describe, it, require */

var app = require('../src/server'),
    request = require('supertest');

describe('Cloud Repertoire landing page', function() {
    "use strict";

    describe('when requesting resource /', function() {
        it('should respond with the landing page', function(done) {
            request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
        });
    });
});

describe('Cloud Repertoire missing ressource', function() {
    "use strict";

    describe('when requesting resource /missing', function() {
        it('should respond with a 404 error', function(done) {
            request(app)
            .get('/missing')
            .expect('Content-Type', /json/)
            .expect(404, done);
        });
    });
});