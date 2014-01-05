/* global afterEach, beforeEach, describe, it, require */

(function() {
    "use strict";

     var app = require('../src/server'),
        _ = require('underscore'),
        assert = require('chai').assert,
        mongoose = require('mongoose'),
        request = require('supertest');

    describe('Cloud Repertoire contacts api', function() {
        var id;

        beforeEach(function(done) {
            mongoose.connection.collections.contacts.drop( function(err) {

                var contact = {
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@email.com"
                };

                mongoose.connection.collections.contacts.insert(contact, function(err, docs) {
                    id = docs[0]._id;
                    done();
                });
            });
        });

        afterEach(function(done) {
            mongoose.connection.collections.contacts.remove({ _id: id }, function(err, doc) {
                done();
            });
        });

        describe('when requesting all contacts', function() {
            it('should respond with 401', function(done){
                request(app)
                .get('/contacts')
                .expect('Content-Type', /json/)
                .expect(401, done);
            });
        });
    });

}());