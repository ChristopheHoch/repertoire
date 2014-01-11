/* global module, require */

var uuid = require('node-uuid'),
    //User = require('../models').model('User'),
    Client = require('../models').client;
//        AuthorizationCode = require('../models').model('AuthorizationCode'),
//        AccessToken = require('../models').model('AccessToken');

//    function serializeClient(client, done) {
//        return done(null, client.id);
//    }

//    function deserializeClient(id, done) {
//        Client.findById(id, function(err, client) {
//            if(err) {
//                return done(err);
//            }
//            return done(null, client);
//        });
//    }

//    function grantAuthorization(client, redirectURI, user, ares, done) {
//        var code = uuid.v4(),
//            ac = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);
//
//        ac.save(function(err) {
//            if(err) {
//                return done(err);
//            }
//            return done(null, code);
//        });
//    }

//    function exchangeToken(client, code, redirectURI, done) {
//        AuthorizationCode.findOne(code, function(err, code) {
//            var token,
//                at;
//
//            if(err) {
//                return done(err);
//            }
//            if(client.id !== code.clientId) {
//                return done(null, false);
//            }
//            if(redirectURI !== code.redirectUri) {
//                return done(null, false);
//            }
//
//            token = uuid.v4();
//            at = new AccessToken(token, code.userId, code.clientId, code.scope);
//            at.save(function(err) {
//                if(err) {
//                    return done(err);
//                }
//                return done(null, token);
//            });
//        });
//    }

function OAuth2() {
    "use strict";

    var oauth2orize = require('oauth2orize');

    this.server = oauth2orize.createServer();
    //        this.server.serializeClient(serializeClient);
    //        this.server.deserializeClient(deserializeClient);
    //        this.server.grant(oauth2orize.grant.code(grantAuthorization));
    //        this.server.exchange(oauth2orize.exchange.code(exchangeToken));

}

module.exports = new OAuth2();