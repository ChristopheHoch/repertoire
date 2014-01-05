/* global exports */

(function() {
    "use strict";

    function ensureLoggedIn(req, res, next) {
        if(!req.isAuthenticated || !req.isAuthenticated()) {
            return res.json(401, { error: 'This ressource is protected, please authenticate first' });
        }
        next();
    }

    exports.index = ensureLoggedIn;

}());