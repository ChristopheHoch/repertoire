/* global afterEach, beforeEach, describe, it, require */

var app = require('../src/server'),
    UserSchema = require('../src/models').user,
    ContactSchema = require('../src/models').contact,
    _ = require('underscore'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    request = require('supertest');

describe('Cloud Repertoire contacts api', function () {
    'use strict';
    var userId,
        contactId;

    beforeEach(function (done) {
        /* Ajout d'un utilisateur */
        userId = undefined;

        var user = new UserSchema({
            email: 'john@test.com',
            password: 'doe'
        });

        user.save(function (error, savedUser) {
            userId = savedUser._id;
        });

        /* Ajout d'un contact */
        contactId = undefined;

        var contact = new ContactSchema({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@email.com'
        });

        contact.save(function (error, savedContact) {
            contactId = savedContact._id;
            done();
        });

    });

    afterEach(function (done) {
        UserSchema.remove({
            _id: userId
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        ContactSchema.remove({
            _id: contactId
        }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        done();
    });

    describe('when requesting all contacts', function () {
        it('should respond with 401', function (done) {
            request(app)
                .get('/api/contacts')
                .expect(401, done);
        });
    });

    describe('when requesting all contacts with a bearer token', function () {

        it('should respond with 401', function (done) {
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
                    var bearerToken;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;

                    request(app)
                        .get('/api/contacts')
                        .set('authorization', bearerToken)
                        .expect(200, done);
                });



        });
    });
});
