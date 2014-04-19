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