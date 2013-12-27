/* global describe, it, require */

(function() {
    "use strict";

    var app = require('../index'),
        request = require('supertest');

    describe('Cloud Repertoire landing page', function(){

        describe('when requesting resource /', function(){
            it('should respond with the landing page', function(done){
                request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200, done);
            });
        });
    });

}());