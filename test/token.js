/* global afterEach, beforeEach, describe, it, require */

var app = require('../src/server'),
    UserSchema = require('../src/models').user,
    _ = require('underscore'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    request = require('supertest');

describe('Cloud Repertoire token', function() {
    "use strict";
    var id;

    beforeEach(function(done) {
        id = undefined;

        var user = new UserSchema({ email: "john@test.com", password: "doe"});

        user.save(function(error, savedUser) {
            id = savedUser._id;
            done();
        });

    });

    afterEach(function(done) {
        UserSchema.remove({ _id: id }, function(err) {
            if(err) {
                console.log(err);
            }
        });
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
                username: 'bob@test.com',
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
                should.exist(returnedUser.access_token);
                should.exist(returnedUser.token_type);
                done();
            });
        });
    });

});