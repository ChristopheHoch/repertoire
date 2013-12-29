/* global describe, it, require */

(function() {
    "use strict";

    var app = require('../index'),
        _ = require('underscore'),
        assert = require('chai').assert,
        mongoose = require('mongoose'),
        request = require('supertest');

    describe('Cloud Repertoire contacts api', function() {
        var id;
        
        beforeEach(function(done) {
            mongoose.connection.collections.contacts.drop( function(err) {
      
                var contact = {
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@email.com"
                };

                mongoose.connection.collections.contacts.insert(contact, function(err, docs) {
                    id = docs[0]._id;
                    done();
                });
            });
        });
        
        afterEach(function(done) {
            mongoose.connection.collections.contacts.remove({ _id: id }, function(err, doc) {
                done();
            });
        });

        describe('when requesting all contacts', function() {
            it('should respond with 200', function(done){
                request(app)
                .get('/contacts')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    var proj = _.first(JSON.parse(res.text));
                    assert(_.has(proj, '_id'), 'contact should contains an id');
                    assert(_.has(proj, 'first_name'), 'contact should contains a first name');
                    assert(_.has(proj, 'last_name'), 'contact should contains a last name');
                    assert(_.has(proj, 'email'), 'contact should contains an email');
                    assert(_.has(proj, 'created'), 'contact should contains a creation date');
                    done();
                });
            });
        });
    });

}());