/* global __dirname, module, require */

(function() {
    "use strict";

    var requireDirectory = require('require-directory');
    module.exports = requireDirectory(module, __dirname);

}());