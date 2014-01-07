/* global exports */

function ensureLoggedIn(req, res, next) {
    "use strict";

    if(!req.isAuthenticated || !req.isAuthenticated()) {
        return res.json(401, { error: 'This ressource is protected, please authenticate first' });
    }
    next();
}

exports.index = ensureLoggedIn;