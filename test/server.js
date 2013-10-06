(function() {
   "use strict";
   
   var should = require('chai').should(),
       foo = 'bar';

   describe('foo', function() {
      it('should be a string', function() {
         foo.should.be.a('string');
      });
      it('should be equal to bar', function() {
         foo.should.equal('bar');
      });
      it('should have a length equal to 3', function() {
         foo.should.have.length(3);
      });
   });
   
}());