/* global console, exports */

(function() {
    "use strict";

    exports.index = function(req, res, next) {
        console.log("Ressource not found");
        res.json(404, 'Ressource not found');
    };

}());