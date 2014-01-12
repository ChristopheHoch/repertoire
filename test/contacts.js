/* global afterEach, beforeEach, describe, it, require */

var app = require('../src/server'),
    ContactSchema = require('../src/models').contact,
    _ = require('underscore'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    request = require('supertest');

describe('Cloud Repertoire contacts api', function() {
    "use strict";
    var id;

    beforeEach(function(done) {
        id = undefined;

        var contact = new ContactSchema({
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@email.com"
        });

        contact.save(function(error, savedContact) {
            id = savedContact._id;
            done();
        });

    });

    afterEach(function(done) {
        ContactSchema.remove({ _id: id }, function(err) {
            if(err) {
                console.log(err);
            }
        });
        done();
    });

    describe('when requesting all contacts', function() {
        it('should respond with 401', function(done){
            request(app)
            .get('/contacts')
            .expect(401, done);
        });
    });
});