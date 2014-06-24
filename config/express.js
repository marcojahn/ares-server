var helmet = require('helmet');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csurf = require('csurf');

var monitoring = require('../middleware/monitoring');

module.exports = function (app, config) {

    app.use(monitoring({}, config));

    app.use(morgan((config.env === 'development') ? 'dev' : 'tiny')); // log every request to the console

    // DO NOT USE bodyParser() - https://gist.github.com/cerebrl/6487587
    // app.use(bodyParser()); // pull information from html in POST
    app.use(bodyParser.json());

    app.use(methodOverride()); // simulate DELETE and PUT
    app.use(cookieParser());
    app.use(session({
        secret: '73ab2c79-6267-4eeb-9f32-caae0bb82f13',
        key: 'ares-sid',
        cookie: {httpOnly: true, maxAge: 1000 * 60 * 60}
    }));

    // if development
    // TODO this has changed with expressjs 4; fixit
    /*app.configure('development', function () {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });*/


    if (config.enableHelmet) {
        app.use(helmet.xframe());
        app.use(helmet.iexss());
        app.use(helmet.contentTypeOptions());
        app.use(helmet.cacheControl());
        app.use(csurf()); // see node_modules/csurf/index.js for details
    }

    // if config setCORSHeaders

};
