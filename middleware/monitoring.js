//https://github.com/mathrawka/express-request-logger/blob/master/index.js

var url = require('url'),
    mongoose = require('mongoose'),
    Monitoring = mongoose.model('Monitoring');

module.exports = function (logger, options) {

    return function (req, res, next) {
        var rEnd = res.end;

        // To track response time
        req._rlStartTime = new Date();

        // Setup the key-value object of data to log and include some basic info
        req.kvLog = {
            created: req._rlStartTime.toISOString(),
            method: req.method,
            url: url.parse(req.originalUrl).pathname,
            parameter: null,
            status: null,
            duration: null,
            reason: null,
            _rlLevel: 'info' // internal usage
            // type: 'reqlog'
        };

        // Proxy the real end function
        res.end = function (chunk, encoding) {
            // Do the work expected
            res.end = rEnd;
            res.end(chunk, encoding);

            // And do the work we want now (logging!)
            // Conditionally do so if url matches a specific exclude.
            //if (options && options.excludes && options.excludes.indexOf(req.kvLog.url) > -1) return;
            if (req.kvLog.url.indexOf('/monitoring') > -1) return;

            // Save a few more variables that we can only get at the end
            req.kvLog.status = res.statusCode;
            req.kvLog.duration = (new Date() - req._rlStartTime);
            req.kvLog.parameter = req.params || null;

            // Send the log off to winston
            /*var level = req.kvLog._rlLevel
             , msg   = req.kvLog.message || '';
             delete req.kvLog._rlLevel;
             if (msg.length) {
             delete req.kvLog.message;
             }
             logger.log(level, msg, req.kvLog);*/

            // modify pathname if necessary
            var pathname = url.parse(req.originalUrl).pathname;

            if (req.params && req.params.id && pathname.substring(pathname.length ,pathname.lastIndexOf("/") + 1) === req.params.id ) {
                req.kvLog.url = pathname.substring(0 ,pathname.lastIndexOf("/"));
            }

            if (res.statusCode !== 200) {
                var reason = chunk;

                try {
                    reason = JSON.parse(chunk).reason
                } catch (e) {}
                finally {
                    req.kvLog.reason = reason;
                }
            }

            var monitoring = new Monitoring(req.kvLog);
            monitoring.save(function (err, user) {
                // TODO winston here!
                console.log('logged to db');
            });
        };

        next();
    };
};