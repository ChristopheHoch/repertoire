/* global console, exports */

(function() {
    "use strict";

    exports.all = function(req, res) {
        console.log('contacts.all');
    };

    exports.get = function(req, res) {
        console.log('contacts.get');
    };

    exports.post = function(req, res) {
        console.log('contacts.post');
    };

    exports.put = function(req, res) {
        console.log('contacts.put');
    };

    exports.del = function(req, res) {
        console.log('contacts.del');
    };

}());