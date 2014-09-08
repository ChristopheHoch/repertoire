/* global module, require */

var nconf = require('nconf');

function Config() {
    'use strict';

    var environment;
    nconf.argv().env('_');
    environment = nconf.get('NODE:ENV') || 'development';
    nconf.file(environment, 'config/' + environment + '.json');
    nconf.file('default', 'config/default.json');
}

Config.prototype.get = function (key) {
    'use strict';
    return nconf.get(key);
};

module.exports = new Config();
