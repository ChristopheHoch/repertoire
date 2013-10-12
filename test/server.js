(function() {
   "use strict";
   
   var should = require('chai').should(),
       app = require('../src/server.js'),
//       config = require('../config.js'),
       request = require('supertest');

   describe('Landing Page', function() {
     
      it('should have an index', function(done) {
         request(app)
         .get('/')
         .expect(200, done);
      });
      
   });
   
}());