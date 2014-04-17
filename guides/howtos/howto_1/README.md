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

All resources (including server side controllers, models, ...) must use pluralized naming conventions (planes, users, ...).

