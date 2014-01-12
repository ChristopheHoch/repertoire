/* global afterEach, beforeEach, describe, it, require */

var app = require('../src/server'),
    UserSchema = require('../src/models').user,
    _ = require('underscore'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    request = require('supertest');

describe('Cloud Repertoire registration api', function() {
    "use strict";
    var ids;

    beforeEach(function(done) {
        ids = [];

        var user = new UserSchema({ email: "john@test.com", password: "doe"});

        user.save(function(error, savedUser) {
            ids.push(savedUser._id);
            done();
        });

    });

    afterEach(function(done) {
        _.each(ids, function(id) {
            UserSchema.remove({ _id: id }, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        });
        done();
    });

    describe('when no content is provided', function() {
        it('should respond with 400', function(done){
            request(app)
            .post('/registration')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(error, doc) {
                var errorMessage = doc.body.error;
                should.exist(errorMessage);
                errorMessage.should.equal("The 'email' field is missing");
                done();
            });
        });
    });

    describe('when no email is provided', function() {
        it('should respond with 400', function(done){
            var user = {
                password: 'marley'
            };

            request(app)
            .post('/registration')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(error, doc) {
                var errorMessage = doc.body.error;
                should.exist(errorMessage);
                errorMessage.should.equal("The 'email' field is missing");
                done();
            });
        });
    });

    describe('when no password is provided', function() {
        it('should respond with 400', function(done){
            var user = {
                email: 'bob@test.com'
            };

            request(app)
            .post('/registration')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(error, doc) {
                var errorMessage = doc.body.error;
                should.exist(errorMessage);
                errorMessage.should.equal("The 'password' field is missing");
                done();
            });
        });
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
                var returnedUser = doc.body;
                should.not.exist(error);
                should.exist(returnedUser);
                should.exist(returnedUser._id);
                should.exist(returnedUser.email);
                returnedUser.email.should.equal(user.email);
                should.exist(returnedUser.password);
                returnedUser.password.should.equal(user.password);
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