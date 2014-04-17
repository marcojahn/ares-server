# Git and Github

The Project will use the [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/) branching model.

## Tooling
- Standard git command line
- [git-flow-avh](https://github.com/petervanderdoes/gitflow)
- Atlassian SourceTree

## Further reading / utils

- [GIT cheatsheet](http://ndpsoftware.com/git-cheatsheet.html)
- [GitFlow cheatsheet](http://danielkummer.github.io/git-flow-cheatsheet/)

## Example

{@img gitflow.png Git Flow workflow}

## GitFlow branches

- master (production)
- develop
- hotfix
- release
- feature
- support

# File structure

All files must follow the [CommonJS Module Syntax](http://wiki.commonjs.org/wiki/Modules/1.1)

    // math.js
    exports.add = function() {
        var sum = 0, i = 0, args = arguments, l = args.length;
        while (i < l) {
            sum += args[i++];
        }
        return sum;
    };

    // increment.js
    var add = require('math').add;
    exports.increment = function(val) {
        return add(val, 1);
    };

    // program.js
    var inc = require('increment').increment;
    var a = 1;
    inc(a); // 2
    module.id == "program";

# Middleware
TODO explain middleware

For special middleware requirements the corresponding features will be implemented and will be located in /middleware.
A middleware implementation behaves like an interceptor that is executed during a client <-> server roundtrip.
Middleware code is executed before the route implementation is executed.

## Middleware example

    // example auth interceptor
    function auth (req, res, next) {
        if (req.session.user.role === 'admin') {
            next();
        } else {
            res.json(401, {success: false, reason: 'NOT_AUTHORIZED');
        }
    };

    users.put('/:id', auth, function (req, res, next) {
        // if authentication passes this code will be executed
        res.json(200, {success: true});
    });

# REST Interface

TODO architectural overview -> apache -> proxy -> nodejs

All resources (including server side controllers, ...) except models(!) must use pluralized naming conventions (planes, users, ...).


Every REST resource follows the following principle

    http(s)://<host:port>/resource

    e.g.
    http://localhost:8080/users/1234

Using Apache http with ExtJS client REST resources will be prefixed with a *WebService/ folder*

    http(s)://<host:port>/WebService/<resource>

    e.g. http://localhost/WebService/users/1234

## Response

HTTP Status Codes will be used for every response indicating the success (or not).

    200     Request successfull, result within response body
    404     Request not successfull, error message within response body
    ...

    Example
    HTTP Status         Response
    200                 {success: true, totalCount: 5, results: [{ /* data */ }]}
    404                 {success: false, reason: 'RESOURCE_NOT_FOUND'}
    401                 {success: false, reason: 'NOT_AUTHORIZED'}

## Overview REST interface to MongoDB

### REST interface to controller

Example based on *users*

    Method      REST resource   Action                  Data in request body        Controller
    GET         /users          list of all users       no                          users.get('/', ...)
    GET         /users/:id      user defined by id      no                          users.get('/:id', ...)
    POST        /users          create a new user       yes                         users.post('/', ...)
    PUT         /users/:id      update a user by id     yes                         users.put('/:id', ...)
    DELETE      /users/:id      delete a user by id     no                          users.delete('/:id', ...)

### Mongoose

TODO howto mongoose and link to it

    // Schema + Model
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var UserSchema = new Schema({
        username: {type: String, required: true, index: {unique: true}},
        password: {type: String, required: true},
        usergroup: {type: String, required: true, default: 'user'},
        email: {type: String, required: true},
        firstname: String,
        lastname: String,
        lockUntil: Date,
        loginAttempts: Number
    });

    // ... more code

    module.exports = mongoose.model('User', UserSchema);

TODO move naming scheme to coding convention and link

    REST resource       Controller      Model           MongoDB collection
    /users              users.js        user.js         users
    /monitoring         monitoring      monitoring.js   monitoring
    /planes             planes.js       plane.js        planes
    ...

### Defining a resource

    // definition in config/routes.js
    var users = require('./controller/users');
    app.resource('users', users);

    // controller/users.js
    var mongoose = require('mongoose'),
        Users = mongoose.model('Users');

    /**
     * @route GET /
     *
     * @anonymous
     * Sends a list of users
     */
    users.get('/', function (req, res, next) {
        User.find({}, function (err, user) {
             /* if (err) handle your error*/

            res.json(200, {
                success: true,
                total: user.length,
                records: user
            });
        });
    });
    // ...

# Async library
Node.js executed everything in an asynchronous manner. Therefore you will have often a very deep intendation of your code.

    someObject.method1('param', function (result) {
        database.doQuery(query, function (dbResult) {
          someOtherObject.method1(dbResult, function (result) {
            res.send(200, result);
          });
        });
    });

To prevent that deep nesting of business logic the async library is used to streamline the asynchronous process.

    async.waterfall([
        function (callback) {
            callback(null, 'one', 'two');
        },
        function (arg1, arg2, callback) {
            // arg1 now equals 'one' and arg2 now equals 'two'
            callback(null, 'three');
        },
        function (arg1, callback) {
            // arg1 now equals 'three'
            callback(null, 'done');
        }
    ], function (err, result) {
        // result now equals 'done'
        res.send(200, result);
    });

# Unit Testing

For unit tests the following libraries are used.

- Mocha (testframework)
- SinonJS (spies and stubs)
- Chai (?)

An example Mocha unit test

    var assert = require("assert")
    describe('Array', function(){
      describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
          assert.equal(-1, [1,2,3].indexOf(5));
          assert.equal(-1, [1,2,3].indexOf(0));
        })
      })
    })

# Build

- Remote
    - Travis-CI will be used to run integration and unit tests after every commit
    - Travis-CI will be covering the following branches
        - development
        - release
        - hotfix
    - Travis-CI will cover the following things
        - are all tests passed
        - are all dependecies (dev and production) up to date
- Local
    - local builds will automatically trigger the following targets
        - unit tests
        - coverage
        - JSHint

        grunt build:production
    - unit tests can be started manually using a Grunt target

        grunt run:tests

# Continuous delivery

Using Travis-CI a successfull build will be automatically deployed to RedHat OpenShift (release branch)

# Code Climate

The Code Climate service will be used with Travis-CI to cover the following metrics

- code coverage
- code quality
    - complexity reports
    - code smells
    - quality trends

# Github project badges

The github project site will present badges of used services

- Dependencies (both dev and production)
- Build status
- Code Climate
    - Coverage
    - Code Climate (1.0 - 5.0)
    - Trend