(function() {
   "use strict";
   
   var should = require('chai').should(),
       config = require('../config.js'),
       server = require('../server.js'),
       port = process.env.PORT || 3000;

   describe('server', function() {
      
      before(function(done) {
         server.listen(port, function (err, result) {
            if (err) {
              done(err);
            } else {
              done();
            }
         });
      });
      
      after(function(done) {
         server.close();
      });
      
      it('should exist', function (done) {
         should.exist(app);
         done();
      });
      
      it('should be listening at localhost', function (done) {
         var headers = defaultGetOptions('/');
         http.get(headers, function (res) {
            res.statusCode.should.eql(404);
            done();
         });
      });
      
   });
   
}());