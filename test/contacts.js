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
        contactIds,
        userData = {
            email: 'john@test.com',
            password: 'doe'
        },
        contactData = {
            firstName: 'John',
            lastName: 'Doe',
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
        contactIds = [];

        var contact = new ContactSchema(contactData);

        contact.save(function (error, savedContact) {
            contactIds.push(savedContact._id);
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
        _.each(contactIds, function (contactId) {
            ContactSchema.remove({
                _id: contactId
            }, function (err) {
                if (err) {
                    console.log(err);
                }
            });
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
                .get('/api/contacts/' + contactIds[0])
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
                        .get('/api/contacts/' + contactIds[0])
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var contact = doc.body;
                            should.not.exist(error);
                            should.exist(contact);
                            should.exist(contact._id);
                            contact.firstName.should.equal(contactData.firstName);
                            contact.lastName.should.equal(contactData.lastName);
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

    describe('when creating a contact with wrong data', function () {
        it('should respond with 400', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        wrongContactData;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    wrongContactData = {
                        name: 'Jack Green'
                    };

                    request(app)
                        .post('/api/contacts')
                        .send(wrongContactData)
                        .set('authorization', bearerToken)
                        .expect(400, done);
                });
        });
    });

    describe('when creating a contact with incomplete data', function () {
        it('should respond with 400', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        incompleteContactData;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    incompleteContactData = {
                        firstName: 'Jack'
                    };

                    request(app)
                        .post('/api/contacts')
                        .send(incompleteContactData)
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var contact = doc.body;
                            should.not.exist(error);
                            should.exist(contact);
                            should.exist(contact._id);
                            contactIds.push(contact._id);
                            should.exist(contact.firstName);
                            contact.firstName.should.equal(incompleteContactData.firstName);
                            should.not.exist(contact.lastName);
                            should.not.exist(contact.email);
                            done();
                        });
                });
        });
    });

    describe('when creating a contact with complete data', function () {
        it('should respond with 400', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        completeContactData;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    completeContactData = {
                        firstName: 'Jack',
                        lastName: 'Green',
                        email: 'jack.green@test.com'
                    };

                    request(app)
                        .post('/api/contacts')
                        .send(completeContactData)
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var contact = doc.body;
                            should.not.exist(error);
                            should.exist(contact);
                            should.exist(contact._id);
                            contactIds.push(contact._id);
                            should.exist(contact.firstName);
                            contact.firstName.should.equal(completeContactData.firstName);
                            should.exist(contact.lastName);
                            contact.lastName.should.equal(completeContactData.lastName);
                            should.exist(contact.email);
                            contact.email.should.equal(completeContactData.email);
                            done();
                        });
                });
        });
    });

});
