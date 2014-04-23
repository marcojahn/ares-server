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
 * # Example dataset GET /

    {
        "success" : true,
        "total" : 2,
        "records" : [
             "/anonymous/sessions",
             "/users"
        ]
    }

 * # Example grouped dataset

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
 * @route GET /route;path=:route(*)
 * Returns pagable data for given route.
 *
 * Example route

    http://localhost:8080/monitoring/route;path=/users

 * @authorization {role} admin
 * @not_yet_implemented
 */
monitoring.get('/route;path=:route(*)', authorize('role:admin'), function (req, res, next) {
    res.json(200, req.params);
});

/**
 * @route GET /aggregate/route;path=:route(*)
 * Returns aggregated data for given route
 *
 * Example route

 http://localhost:8080/monitoring/aggregate/route;path=/users

 * @authorization {role} admin
 */
monitoring.get('/aggregate/route;path=:route(*)', authorize('role:admin'), function (req, res, next) {
    var match = {$match: {url: req.params.route}};

    Monitoring.aggregate(
        buildRouteAggregationPipeline(match),
        function (err, result) {
            res.json(200, {
                success: true,
                total: result.length,
                records: result
            });
        }
    )
});

/**
 * @route GET /aggregate
 * Returns aggregated data for all monitored routes.
 *
 * Example route

 http://localhost:8080/monitoring/aggregate

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
 * @not_yet_implemented
 */
monitoring.delete('/purge', authorize('role:admin'), function (req, res, next) {
    res.json(200, {success: true});
});

/**
 * @route DELETE /
 * Deletes all monitoring data for a given route.
 *
 * @authorization {role} admin
 * @not_yet_implemented
 */
monitoring.delete('/:route(*)', authorize('role:admin'), function (req, res, next) {
    res.json(200, {success: true});
});

/**
 * @method buildRouteAggregationPipeline
 * @private
 *
 * Builds the monitoring aggregation pipeline. An additional match parameter can be given and will be inserted at first
 * array index.
 *
 * @param {Object} match MongoDB matching object.
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