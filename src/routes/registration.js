/* global exports, require */

(function() {
    "use strict";

    var UserService = require('../services').users,
        User = new UserService();

    exports.index = function(req, res) {
        var email = req.body.email,
            password = req.body.password;

        User.post(email, password, function(error, user) {
            if(error) {
                return res.json(error.code, { error: error.message });
            }
            return res.json(201, user);
        });

    };

}());