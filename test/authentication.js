/* global afterEach, beforeEach, describe, it, require */

var app = require('../src/server'),
    UserSchema = require('../src/models').user,
    _ = require('underscore'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    request = require('supertest');

describe('Cloud Repertoire token', function () {
    'use strict';
    var id;

    beforeEach(function (done) {
        id = undefined;

        var user = new UserSchema({
            email: 'john@test.com',
            password: 'doe'
        });

        user.save(function (error, savedUser) {
            id = savedUser._id;
            done();
        });

    });

    afterEach(function (done) {
        UserSchema.remove({
            _id: id
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        done();
    });

    describe('when login with no data', function () {
        it('should respond with 400', function (done) {

            request(app)
                .post('/authenticate')
                .send({})
                .expect(400, done);
        });
    });

    describe('when login with no email', function () {
        it('should respond with 400', function (done) {
            var user = {
                password: 'marley'
            };

            request(app)
                .post('/authenticate')
                .send(user)
                .expect(400, done);
        });
    });

    describe('when login with no password', function () {
        it('should respond with 400', function (done) {
            var user = {
                email: 'bob@test.com'
            };

            request(app)
                .post('/authenticate')
                .send(user)
                .expect(400, done);
        });
    });

    describe('when login with non-registered email', function () {
        it('should respond with 401', function (done) {
            var data = {
                email: 'bob@test.com',
                password: 'marley'
            };

            request(app)
                .post('/authenticate')
                .send(data)
                .expect(401, done);
        });
    });

    describe('when login with wrong password', function () {
        it('should respond with 401', function (done) {
            var user = {
                email: 'john@test.com',
                password: 'foobar'
            };

            request(app)
                .post('/authenticate')
                .send(user)
                .expect(401, done);
        });
    });

    describe('when login with correct credentials', function () {
        it('should respond with 200', function (done) {
            var user = {
                email: 'john@test.com',
                password: 'doe'
            };

            request(app)
                .post('/authenticate')
                .send(user)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);
                    done();
                });
        });
    });

});
