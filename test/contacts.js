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
        contactId,
        userData = {
            email: 'john@test.com',
            password: 'doe'
        },
        contactData = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@email.com'
        };

    beforeEach(function (done) {
        /* Ajout d'un utilisateur */
        userId = undefined;

        var user = new UserSchema(userData);

        user.save(function (error, savedUser) {
            userId = savedUser._id;
        });

        /* Ajout d'un contact */
        contactId = undefined;

        var contact = new ContactSchema(contactData);

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

    /**
     * Test of GET /api/contacts
     */
    describe('when requesting all contacts without being authenticated', function () {
        it('should respond with 401', function (done) {
            request(app)
                .get('/api/contacts')
                .expect(401, done);
        });
    });

    describe('when requesting all contacts with a bearer token', function () {

        it('should respond with 401', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
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

    /**
     * Test of GET /api/contacts/:id
     */
    describe('when requesting a contact  without being authenticated', function () {
        it('should respond with 401', function (done) {
            request(app)
                .get('/api/contacts/' + contactId)
                .expect(401, done);
        });
    });

    describe('when requesting a incorrect contact id', function () {

        it('should respond with 404', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;

                    request(app)
                        .get('/api/contacts/12345')
                        .set('authorization', bearerToken)
                        .expect(500, done);
                });

        });
    });

    describe('when requesting a non existing contact id', function () {

        it('should respond with 404', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;

                    request(app)
                        .get('/api/contacts/' + userId)
                        .set('authorization', bearerToken)
                        .expect(404, done);
                });

        });
    });

    describe('when requesting an existing contact id', function () {

        it('should respond with 200', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;

                    request(app)
                        .get('/api/contacts/' + contactId)
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var contact = doc.body;
                            should.not.exist(error);
                            should.exist(contact);
                            should.exist(contact._id);
                            contact.first_name.should.equal(contactData.first_name);
                            contact.last_name.should.equal(contactData.last_name);
                            contact.email.should.equal(contactData.email);
                            done();
                        });
                });

        });
    });

    /**
     * Test of POST /api/contacts
     */
    describe('when creating a contact  without being authenticated', function () {
        it('should respond with 401', function (done) {
            request(app)
                .post('/api/contacts')
                .expect(401, done);
        });
    });

    describe('when creating a contact without no data', function () {
        it('should respond with 400', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;

                    request(app)
                        .post('/api/contacts')
                        .set('authorization', bearerToken)
                        .expect(400, done);
                });
        });
    });

});
