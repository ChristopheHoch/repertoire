/* global console, exports */

(function() {
    "use strict";

    exports.login = function(req, res) {
        console.log('authentication.login');
    };

    exports.logout = function(req, res) {
        console.log('authentication.logout');
    };

}());