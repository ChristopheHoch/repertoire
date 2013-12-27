module.exports = process.env.REPERTOIRE_COV ?
    require('./lib-cov/server') : require('./lib/server');