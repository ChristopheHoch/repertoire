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
        contactDataLyon = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            address: 'Lyon',
            location: {
                'type': 'Point',
                coordinates: [4.5032, 45.4535]
            }
        };

    before(function (done) {
        /* Ajout d'un utilisateur */
        userId = undefined;

        var user = new UserSchema(userData);

        user.save(function (error, savedUser) {
            userId = savedUser._id;
            done();
        });
    });

    beforeEach(function (done) {
        /* Ajout d'un contact */
        contactIds = [];

        var contact = new ContactSchema(contactDataLyon);

        contact.save(function (error, savedContact) {
            contactIds.push(savedContact._id);
            done();
        });
    });

    afterEach(function (done) {
        ContactSchema.remove().exec();
        //        _.each(contactIds, function (contactId) {
        //            ContactSchema.remove({
        //                _id: contactId
        //            }, function (err) {
        //                if (err) {
        //                    console.log(err);
        //                }
        //            });
        //        });
        done();
    });

    after(function (done) {
        UserSchema.remove().exec();
        //        UserSchema.remove({
        //            _id: userId
        //        }, function (err) {
        //            if (err) {
        //                console.log(err);
        //            }
        //        });
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
                        .get('/api/contacts')
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var body = doc.body,
                                contact = body[0].obj;

                            should.not.exist(error);
                            should.exist(body);
                            body.length.should.equal(1);
                            should.exist(contact);
                            contact.firstName.should.equal(contactDataLyon.firstName);
                            contact.lastName.should.equal(contactDataLyon.lastName);
                            contact.email.should.equal(contactDataLyon.email);
                            contact.address.should.equal(contactDataLyon.address);
                            contact.location.should.eql(contactDataLyon.location);
                            done();
                        });
                });



        });
    });

    describe('when requesting all contacts with a bearer token but no contact does exist', function () {
        it('should respond with an empty object', function (done) {

            ContactSchema.remove({
                _id: contactIds[0]
            }, function (err) {
                if (!err) {
                    contactIds.pop();
                }
            });

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
                        .expect(200)
                        .end(function (error, doc) {
                            var body = doc.body;

                            should.not.exist(error);
                            should.exist(body);
                            body.length.should.equal(0);
                            done();
                        });
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
        it('should respond with 500', function (done) {

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
                            contact.firstName.should.equal(contactDataLyon.firstName);
                            contact.lastName.should.equal(contactDataLyon.lastName);
                            contact.email.should.equal(contactDataLyon.email);
                            contact.address.should.equal(contactDataLyon.address);
                            contact.location.should.eql(contactDataLyon.location);
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

    describe('when creating a contact with no data', function () {
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
        it('should respond with 200', function (done) {

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
                            should.not.exist(contact.address);
                            should.not.exist(contact.location);
                            done();
                        });
                });
        });
    });

    describe('when creating a contact with complete data', function () {
        it('should respond with 200', function (done) {

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
                        email: 'jack.green@test.com',
                        address: 'Paris',
                        location: {
                            'type': 'Point',
                            coordinates: [2.2107, 48.5124]
                        }
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
                            contact.firstName.should.equal(completeContactData.firstName);
                            contact.lastName.should.equal(completeContactData.lastName);
                            contact.email.should.equal(completeContactData.email);
                            contact.address.should.equal(completeContactData.address);
                            contact.location.should.eql(completeContactData.location);
                            done();
                        });
                });
        });
    });

    /**
     * Test of PUT /api/contacts/:id
     */
    describe('when deleting a contact  without being authenticated', function () {
        it('should respond with 401', function (done) {
            request(app)
                .put('/api/contacts/' + contactIds[0])
                .expect(401, done);
        });
    });

    describe('when updating a contact with wrong data', function () {
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
                        .put('/api/contacts/' + contactIds[0])
                        .send(wrongContactData)
                        .set('authorization', bearerToken)
                        .expect(400, done);
                });
        });
    });

    describe('when updating an incorrect contact id', function () {
        it('should respond with 500', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        updateData;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    updateData = {
                        firstName: 'Jenny'
                    };

                    request(app)
                        .put('/api/contacts/12345')
                        .send(updateData)
                        .set('authorization', bearerToken)
                        .expect(500, done);
                });

        });
    });

    describe('when partially updating a correct contact id', function () {
        it('should respond with 200', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        updateData;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    updateData = {
                        firstName: 'Jenny'
                    };

                    request(app)
                        .put('/api/contacts/' + contactIds[0])
                        .send(updateData)
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var body = doc.body;

                            should.not.exist(error);
                            should.exist(body);
                            should.exist(body._id);
                            body._id.should.equal(contactIds[0].toString());
                            body.firstName.should.not.equal(contactDataLyon.firstName);
                            body.firstName.should.equal(updateData.firstName);
                            body.lastName.should.equal(contactDataLyon.lastName);
                            body.email.should.equal(contactDataLyon.email);
                            body.address.should.equal(contactDataLyon.address);
                            body.location.should.eql(contactDataLyon.location);
                            done();
                        });
                });

        });
    });

    describe('when totally updating a correct contact id', function () {
        it('should respond with 200', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        updateData;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    updateData = {
                        firstName: 'Jenny',
                        lastName: 'Dale',
                        email: 'jenny.dale@test.com',
                        address: 'Paris',
                        location: {
                            'type': 'Point',
                            coordinates: [2.2107, 48.5124]
                        }
                    };

                    request(app)
                        .put('/api/contacts/' + contactIds[0])
                        .send(updateData)
                        .set('authorization', bearerToken)
                        .expect(200)
                        .end(function (error, doc) {
                            var body = doc.body;

                            should.not.exist(error);
                            should.exist(body);
                            should.exist(body._id);
                            body._id.should.equal(contactIds[0].toString());
                            body.firstName.should.equal(updateData.firstName);
                            body.lastName.should.equal(updateData.lastName);
                            body.email.should.equal(updateData.email);
                            body.address.should.equal(updateData.address);
                            body.location.should.eql(updateData.location);
                            done();
                        });
                });

        });
    });

    /**
     * Test of DELETE /api/contacts/:id
     */
    describe('when deleting a contact  without being authenticated', function () {
        it('should respond with 401', function (done) {
            request(app)
                .delete('/api/contacts/' + contactIds[0])
                .expect(401, done);
        });
    });

    describe('when deleting an incorrect contact id', function () {
        it('should respond with 500', function (done) {

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
                        .delete('/api/contacts/12345')
                        .set('authorization', bearerToken)
                        .expect(500, done);
                });

        });
    });

    describe('when deleting a non existing contact id', function () {
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
                        .delete('/api/contacts/' + userId)
                        .set('authorization', bearerToken)
                        .expect(404, done);
                });

        });
    });

    describe('when deleting an existing contact id', function () {
        it('should respond with 200', function (done) {

            request(app)
                .post('/authenticate')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (error, doc) {
                    var bearerToken,
                        contactId;

                    should.not.exist(error);
                    should.exist(doc.body);
                    should.exist(doc.body.token);

                    bearerToken = 'Bearer ' + doc.body.token;
                    contactId = contactIds.pop();

                    request(app)
                        .delete('/api/contacts/' + contactId)
                        .set('authorization', bearerToken)
                        .expect(200, done);
                });

        });
    });

});
