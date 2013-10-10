(function() {
   "use strict";
   
   var should = require('chai').should(),
       app = require('../server.js'),
       config = require('../config.js'),
       request = require('supertest');

   describe('server', function() {
     
      it('should have an index', function (done) {
         request(app)
         .get('http://www.google.fr/')
         .expect(200)
         .end(function(err, res) {
            if(err) {
               return done(err);
            }
            done();
         });
      });
      
   });
   
}());