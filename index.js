/* global module, process, require */

(function() {
    "use strict";

    module.exports = process.env.REPERTOIRE_COV ?
        require('./lib-cov/server') : require('./lib/server');

}());