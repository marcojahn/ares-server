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
            url: '',
            parameter: null,
            status: null,
            duration: null,
            reason: null,
            _rlLevel: 'info' // internal usage
        };

        // Proxy the real end function
        res.end = function (chunk, encoding) {
            // Do the work expected
            res.end = rEnd;
            res.end(chunk, encoding);

            url = (req.route) ? req.baseUrl + req.route.path : req.originalUrl;

            // Save a few more variables that we can only get at the end
            req.kvLog.status = res.statusCode;
            req.kvLog.duration = (new Date() - req._rlStartTime);
            req.kvLog.parameter = req.params || null;
            req.kvLog.url = url;

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