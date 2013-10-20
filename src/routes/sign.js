(function() {
   "use strict";
   
   exports.signin = function(req, res) {
      res.redirect('/');
   };
   
   exports.signout = function(req, res) {
      req.logout();
      res.redirect('/');
   };
   
}());