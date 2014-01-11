/* global exports, require */

var UserService = require('../services').users,
    User = new UserService();

function registration(req, res) {
    "use strict";

    var email = req.body.email,
        password = req.body.password;

    console.log(req.body);
    if(!email) {
        return res.json(400, { error: "The 'email' field is missing" });
    }
    if(!password) {
        return res.json(400, { error: "The 'password' field is missing" });
    }
    User.post(email, password, function(error, user) {
        if(error) {
            return res.json(error.code, { error: error.message });
        }
        return res.json(201, user);
    });

}

exports.index = registration;