/* global __dirname, module, require */

var requireDirectory = require('require-directory');

module.exports = requireDirectory(module, __dirname);