/* global console, exports */

function notFound(req, res, next) {
    "use strict";
    res.json(404, { error: 'Ressource not found' });
}

exports.index = notFound;