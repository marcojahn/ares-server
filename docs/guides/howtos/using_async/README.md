# Async library
Node.js executed everything in an asynchronous manner. Therefore you will have often a very deep intendation of your code.

To prevent that deep nesting of business logic the [async library](https://github.com/caolan/async) is used to streamline the asynchronous process.

## Example implementation
An example implementation of the async library can be found in controller/reservation.js where two methods are implemented twice

- listReservations[Async]
- listAvailablePlanesForUser[Async]

### Code examples

Classic way

    reservations.listAvailablePlanesForUser = function (req, res, next) {
        var userId = req.session.user._id;
        
        // gather license informations
        User.findById(userId, function (err, user) {
            if (err) next(err);
    
            var i, matcher,
                userLicenses = user.getValidLicenses(),
                matcherList = [],
                iLen = userLicenses.length;
    
            for (i = 0; i < iLen; i++) {
                matcherList.push(userLicenses[i].planetype);
            }
    
            matcher = {planetype: {$in: matcherList}};
    
            Plane.find(matcher, function (err, availablePlanes) {
                res.json({
                    success: true,
                    total: availablePlanes.length,
                    records: availablePlanes
                });
            });
        });
    };

Async waterfall

    reservations.listAvailablePlanesForUserAsync = function (req, res, next) {
        var userId = req.session.user._id;
    
        async.waterfall([
            function (callback) { // find user
                User.findById(userId, callback);
            },
            function (user, callback) { // check for valid licenses
                var i, matcher,
                    userLicenses = user.getValidLicenses(),
                    matcherList = [],
                    iLen = userLicenses.length;
    
                for (i = 0; i < iLen; i++) {
                    matcherList.push(userLicenses[i].planetype);
                }
    
                matcher = {planetype: {$in: matcherList}};
                callback(null, matcher);
            },
            function (matcher, callback) { // find plane for matching licenses
                Plane.find(matcher, callback);
            }
        ], function (err, availablePlanes) {
                if (err) next(err);
    
                res.json({
                    success: true,
                    total: availablePlanes.length,
                    records: availablePlanes
                });
            }
        );
    };