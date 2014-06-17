/**
 * @class ares.server.controller.Monitoring
 *
 * Provides monitoring REST interface.
 *
 * This interface provides information to monitor the application. Provided data are:
 * - list of resources monitoried
 * - grouped results
 * - deleting monitoring data for a specific resource
 * - purging the full monitoring data
 *
 * # Monitoring document

    {
        "_id" : ObjectId("5357c8c8cd0ca5161bd743d3"),
        "method" : "PUT",
        "url" : "/users",
        "parameter" : {
            "id" : "534d4f037d586bd10b8f2424"
        },
        "status" : 200,
        "duration" : 6,
        "reason" : null,
        "created" : ISODate("2014-04-23T14:06:00.899Z"),
        "__v" : 0
    }

 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */
var express = require('express'),
    mongoose = require('mongoose'),
    Monitoring = mongoose.model('Monitoring');

var monitoring = express.Router();
exports = module.exports = monitoring;

// TODO placeholder, remove after fully implemented
var authorize = function () {
    return function (req, res, next) {
        next();
    };
};

/**
 * @route GET /
 * Returns a list of availble monitored routes.

    {
         "success" : true,
         "total" : 2,
         "records" : [
             "/anonymous/sessions",
             "/users"
         ]
    }

 * @authorization {role} admin
 */
monitoring.get('/', authorize('role:admin'), function (req, res, next) {
    //res.send('200', 'get all the planes 3');

    Monitoring.distinct('url', function (err, result) {
        // TODO
        if (err) console.log(err);
        if (!result) console.log(new Error('Failed to load distinct routes: ' + result));

        res.json(200, {
            success: true,
            total: result.length,
            records: result
        });

    });
});

/**
 * @route GET /route?route=(String)&page=(Number)&limit=(Number)
 * Returns pagable data for given route.
 *
 * Example route

     http://localhost:8080/monitoring/route?route=/users&page=1&limit=25
 *
 * @routeparam {String} route Route.
 * @routeparam {Number} [page=1] (optional) page Page to display.
 * @routeparam {Number} [limit=25] (optional) limit Number of records for page.
 *
 * @authorization {role} admin
 * @not_yet_implemented
 */
// TODO add paging
monitoring.get('/route', authorize('role:admin'), function (req, res, next) {
    // TODO use aggregate to get total sum
    // req.query.limit
    // req.query.page
    // TODO calculate limit + page to skip
    // http://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js


    // TODO rewrite to ASYNC parallels to collect the full recordset (2 async calls find+count)
    Monitoring.find(
        {url: req.query.route},
        null,
        {
            skip: 0, // TODO params
            limit: 10, // TODO params
            sort: {
                created: -1
            }
        },
        function (err, result) {
            // TODO
            if (err) console.log(err);
            if (!result) console.log(new Error('Error: ' + result));

            Monitoring.count({url: req.params.route}, function (err, count) {
                res.json(200, { // TODO pagable result set!!
                    success: true,
                    total: count,
                    records: result
                });
            });
        }
    );
});

/**
 * @route GET /aggregate
 * Returns aggregated data for all monitored routes.
 *
 * Example route

    // http://localhost:8080/monitoring/aggregate

    {
        "success" : true,
        "total" : 2,
        "records" : [
            {
                "_id" : "/anonymous/sessions",
                "maxDuration" : 98,
                "total" : 7,
                "minDuration" : 86,
                "avgDuration" : 90.71428571428571
            },
            {
                "_id" : "/users",
                "maxDuration" : 4,
                "total" : 4,
                "minDuration" : 2,
                "avgDuration" : 3
            }
        ]
    }

 * @authorization {role} admin
 */
monitoring.get('/aggregate', authorize('role:admin'), function (req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.aggregate
    // http://stackoverflow.com/questions/14653282/mongodb-aggregation-how-to-return-a-the-object-with-min-max-instead-of-the-valu
    // https://groups.google.com/forum/#!topic/mongodb-user/Y1syjLwTQPE
    // http://docs.mongodb.org/manual/reference/operator/aggregation/group/
    /*Monitoring.aggregate(
     {$group: {_id: 'url', maxDuration: {$max: '$duration'}}}
     , function (err, result) {
     res.json(200, result);
     });*/

    // http://www.mikitamanko.com/blog/2013/08/25/mongoose-aggregate-with-group-by-nested-field/
    Monitoring.aggregate(
        buildRouteAggregationPipeline(),
        function (err, result) {
            // TODO
            if (err) console.log(err);
            if (!result) console.log(new Error('Failed to load distinct routes: ' + result));

            res.json(200, {
                success: true,
                total: result.length,
                records: result
            });
        }
    )
});

/**
 * @route GET /aggregate/route?route=(*)
 * Returns aggregated data for given route
 *
 * Example route

    http://localhost:8080/monitoring/aggregate/route?route=/users
 *
 * @routeparam {String} route Route.
 * @authorization {role} admin
 */
monitoring.get('/aggregate/route', authorize('role:admin'), function (req, res, next) {
    var match = {$match: {url: req.query.route}};

    Monitoring.aggregate(
        buildRouteAggregationPipeline(match),
        function (err, result) {
            // TODO
            if (err) console.log(err);
            if (!result) console.log(new Error('Error: ' + result));

            res.json(200, {
                success: true,
                total: result.length,
                records: result
            });
        }
    )
});

/**
 * @route DELETE /purge
 * Purges the complete monitoring collection.
 *
 * @authorization {role} admin
 */
monitoring.delete('/purge', authorize('role:admin'), function (req, res, next) {
    Monitoring.remove({}, function (err, result) {
        // TODO
        if (err) console.log(err);
        if (!result) console.log(new Error('Failed to load distinct routes: ' + result));

        res.json(200, {success: true});
    });
});

/**
 * @route DELETE /route?route=(String)
 * Deletes all monitoring data for a given route.
 *
 * @routeparam {String} route Route.
 *
 * @authorization {role} admin
 */
monitoring.delete('/route', authorize('role:admin'), function (req, res, next) {
    var match = {url: req.query.route};

    Monitoring.remove(match, function (err, result) {
        // TODO
        if (err) console.log(err);
        if (!result) console.log(new Error('Failed to load distinct routes: ' + result));

        res.json(200, {success: true});
    });
});

/**
 * @route GET /sessions
 * Provides a list af currently active sessions
 *
 * @authorization {role} admin
 */
monitoring.get('/sessions', authorize('role:admin'), function (req, res, next) {
    var sessionData,
        result = [],
        sessionList = req.sessionStore.sessions;

    for (session in sessionList) {
        if (sessionList.hasOwnProperty(session)) {
            sessionData = JSON.parse(sessionList[session]);
            result.push({
                sid: session,
                user: (sessionData.user) ? sessionData.user.username : 'anonymous',
                usergroup: (sessionData.user) ? sessionData.user.usergroup : 'anonymous',
                expires: sessionData.cookie.expires
            });
        }
    }

    res.json(200, {
        success: true,
        total: result.length,
        records: result
    });

});

/**
 * @method buildRouteAggregationPipeline
 * @private
 *
 * Builds the monitoring aggregation pipeline. An additional match parameter can be given and will be inserted at first
 * array index.
 *
 * @param {Object} (optional) match MongoDB matching object.
 *
 * @return {Objects[]} Returns an array of objects defining the aggregation pipeline.
 */
var buildRouteAggregationPipeline = function (match) {
    var aggregation = [
        {$project: {
            _id: 0,
            duration: 1,
            url: 1
        }},
        {$group: {
            _id: '$url',
            minDuration: {$min: '$duration'},
            maxDuration: {$max: '$duration'},
            avgDuration: {$avg: '$duration'},
            total: {$sum: 1}
        }}
    ];

    if (match) {
        aggregation.unshift(match);
    }

    return aggregation;
};