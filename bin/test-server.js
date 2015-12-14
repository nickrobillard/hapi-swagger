'use strict';

var BearerToken = require('hapi-auth-bearer-token'),
    Blipp = require('blipp'),
    H2o2 = require('h2o2'),
    Hapi = require('hapi'),
    Inert = require('inert'),
    Vision = require('vision');

var HapiSwagger = require('../'),
    Pack = require('../package'),
    Routes = require('./routes');


/**
 * validation function for bearer strategy
 *
 * @param  {Object} token
 * @param  {Function} callback
 */
var validateBearer = function (token, callback) {

    if (token === '12345') {
        callback(null, true, {
            token: token,
            user: {
                username: 'glennjones',
                name: 'Glenn Jones',
                groups: ['admin', 'user']
            }
        });
    } else {
        // for bad token keep err as null
        callback(null, false, {});
    }
};



var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});

var swaggerOptions = {
    info: {
        'title': 'Test API Documentation',
        'description': 'This is a sample example of API documentation.',
        'version': Pack.version,
        'termsOfService': 'https://github.com/glennjones/hapi-swagger/',
        'contact': {
            'email': 'glennjonesnet@gmail.com'
        },
        'license': {
            'name': 'MIT',
            'url': 'https://raw.githubusercontent.com/glennjones/hapi-swagger/master/license.txt'
        }
    },
    tags: [{
        'name': 'store',
        'description': 'Storing a sum',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }, {
        'name': 'sum',
        'description': 'API of sums',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }]
};


server.register([
    Inert,
    Vision,
    Blipp,
    H2o2,
    BearerToken,
    {
        register: HapiSwagger,
        options: swaggerOptions
    }], function (err) {

        server.auth.strategy('bearer', 'bearer-access-token', {
            'accessTokenName': 'access_token',
            'validateFunc': validateBearer
        });
        server.start(function () {

            console.log('server running at:', server.info.uri);
        });
    });

server.route(Routes);
