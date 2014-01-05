/* global afterEach, beforeEach, describe, it, require */

(function() {
    "use strict";

    var app = require('../src/server'),
        _ = require('underscore'),
        assert = require('chai').assert,
        mongoose = require('mongoose'),
        request = require('supertest');

    describe('Cloud Repertoire registration api', function() {
        var ids;

        beforeEach(function(done) {
            ids = [];

            mongoose.connection.collections.users.drop( function(error) {

                var user = {
                    email: "john@test.com",
                    password: "doe"
                };

                mongoose.connection.collections.users.insert(user, function(err, docs) {
                    ids.push(docs[0]._id);
                    done();
                });
            });
        });

        afterEach(function(done) {
            _.each(ids, function(id) {
                mongoose.connection.collections.users.remove({ _id: id }, function(err, doc) { });
            });
            done();
        });

        describe('when registering a new user', function() {
            it('should respond with 201', function(done){
                var user = {
                    email: 'bob@test.com',
                    password: 'marley'
                };

                request(app)
                .post('/registration')
                .send(user)
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function(error, doc) {
                    var returnedUser = JSON.parse(doc.text);
                    assert(_.has(returnedUser, '_id'), 'user should have an id');
                    assert(_.has(returnedUser, 'email'), 'user should have an email');
                    assert(_.has(returnedUser, 'password'), 'user should have a password');
                    ids.push(returnedUser._id);
                    done();
                });
            });
        });

        describe('when registering an existing user', function() {
            it('should respond with 409', function(done){
                var user = {
                    email: "john@test.com",
                    password: "doe"
                };

                request(app)
                .post('/registration')
                .send(user)
                .expect('Content-Type', /json/)
                .expect(409, done);
            });
        });

    });

}());