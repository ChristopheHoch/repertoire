/* global console, exports */

(function() {
    "use strict";

    exports.index = function(req, res, next) {
        res.json(404, { error: 'Ressource not found' });
    };

}());