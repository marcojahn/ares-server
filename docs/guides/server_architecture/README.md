# ARES server architecture

## Technology stack
- JavaScript onlny
- Server node.js
    - [expressjs](http://expressjs.com/)
    - [express-winston](https://github.com/heapsource/express-winston)
    - [async](https://github.com/caolan/async)
- MongoDB
    - [mongoose](http://mongoosejs.com/)

## Architectural overview

{@img pac-exam-architectural-overview.png Architectural overview}

## Filesystem overview

    app.js              application; executed by PM2
    package.json        dependency defintion; used by npm install
    config/             configuration files (environment, routing, expressjs, ...)
    controller/         application controller, route dispatching
    model/              mongodb models
    middleware/         custom expressjs middleware (authentication, authorization, monitoring, ...)
    build/              deployable *.zip file, api documentation, ...
    test/

## File structure

All files must follow the [CommonJS Module Syntax](http://wiki.commonjs.org/wiki/Modules/1.1)

[Export this: Interface Design patterns for node.js modules](http://bites.goodeggs.com/posts/export-this/)

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
