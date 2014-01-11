/* global afterEach, beforeEach, describe, it, require */

var app = require('../src/server'),
    _ = require('underscore'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    request = require('supertest');

describe('Cloud Repertoire token', function() {
    "use strict";
    var id;

    beforeEach(function(done) {
        id = undefined;

        mongoose.connection.collections.users.drop( function(error) {

            var user = {
                email: "john@test.com",
                password: "doe"
            };

            mongoose.connection.collections.users.insert(user, function(err, docs) {
                id = docs[0]._id;
                done();
            });
        });
    });

    afterEach(function(done) {
        mongoose.connection.collections.users.remove({ _id: id }, function(err, doc) { });
        done();
    });

    describe('when login with no data', function() {
        it('should respond with 401', function(done){

            request(app)
            .post('/token')
            .send({})
            .expect(401, done);
        });
    });

    describe('when login with no email', function() {
        it('should respond with 401', function(done){
            var user = {
                password: 'marley'
            };

            request(app)
            .post('/token')
            .send(user)
            .expect(401, done);
        });
    });

    describe('when login with no password', function() {
        it('should respond with 401', function(done){
            var user = {
                email: 'bob@test.com'
            };

            request(app)
            .post('/token')
            .send(user)
            .expect(401, done);
        });
    });

    describe('when login with non-registered email', function() {
        it('should respond with 401', function(done){
            var data = {
//                grant_type: 'password',
                email: 'bob@test.com',
                password: 'marley'
            };

            request(app)
            .post('/token')
            .send(data)
            .expect(401, done);
        });
    });

    describe('when login with wrong password', function() {
        it('should respond with 401', function(done){
            var user = {
                username: 'john@test.com',
                password: 'foobar'
            };

            request(app)
            .post('/token')
            .send(user)
            .expect(401, done);
        });
    });

    describe('when login with correct credentials', function() {
        it('should respond with 200', function(done){
            var user = {
                grant_type: 'password',
                username: 'john@test.com',
                password: 'doe'
            };

            request(app)
            .post('/token')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(error, doc) {
                var returnedUser = doc.body;
                should.not.exist(error);
                should.exist(returnedUser);
                should.exist(returnedUser._id);
                should.exist(returnedUser.email);
                returnedUser.email.should.equal(user.email);
                should.exist(returnedUser.password);
                returnedUser.password.should.equal(user.password);
            });
        });
    });

});