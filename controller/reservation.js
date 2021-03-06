/**
 * @class ares.server.controller.Reservation
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */
var util = require('util'),
    express = require('express'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    async = require('async'),
    authorization = require('../middleware/authorization'),
    User = mongoose.model('User'),
    Plane = mongoose.model('Plane'),
    Reservation = mongoose.model('Reservation');

var WORKFLOW = {
    start: 'reserved',
    status: {
        reserved: {
            value: 'Reserved',
            next: ['lent', 'cancelled']
        },
        cancelled: {
            value: 'Cancelled',
            next: false
        },
        lent: {
            value: 'Lent',
            next: ['cancelled', 'returned']
        },
        returned: {
            value: 'Returned',
            next: false
        }
    }
};

var reservations = {};
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = reservations;
reservations.routes = express.Router();

function buildStatusGridFilter (req) {
    var i, iLen, filterList, list,
        matcher = {};

    // parse filter
    if (req.query.filter) {
        list = [];
        filterList = JSON.parse(req.query.filter)[0];

        for (i = 0, iLen = filterList.value.length; i < iLen; i++) {
            list.push(filterList.value[i]);
        }

        matcher = {'status': {$in: list}};
    }

    return matcher;
}

reservations.listReservationsAsync = function (req, res, next) {
    var matcher = buildStatusGridFilter(req);

    async.waterfall([
        function (callback) {
            Reservation.find(matcher, callback);
        }
    ], function (err, reservation) {
        if (err) return next(err);

        res.json({
            success: true,
            total: reservation.length,
            records: reservation
        });
    });
};

reservations.listReservations = function (req, res, next) {
    var matcher = buildStatusGridFilter(req);

    Reservation.find(matcher, function (err, reservation) {
        if (err) return next(err);

        res.json({
            success: true,
            total: reservation.length,
            records: reservation
        });
    });
};

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
    });
};

reservations.listAvailablePlanesForUser = function (req, res, next) {
    // gather license informations
    User.findById(req.session.user._id, function (err, user) {
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

reservations.creatReservation = function (req, res, next) {
    if (req.body.status) {
        delete req.body.status;
    }

    // check if time slot for reservation is already used
    var startDate = moment(req.body.start);
    var endDate = moment(req.body.until);
    var planeType = req.body.planetype;
    var plane = req.body.plane;

    Reservation.findOne(
        {$and: [
            //{planetype: planeType},
            {plane: plane},
            {status: {$in: ['reserved', 'lent']}}, // TODO dynamically
            {$or: [
                // existing startdate in new range
                {start: {$gte: startDate, $lte: endDate}},

                // existing enddate in new range
                {until: {$gte: startDate, $lte: endDate}},

                // new range is between existing startdate and enddate
                {$and: [
                    {start: {$lte: startDate}},
                    {until: {$gte: endDate}}
                ]},

                // existing startdate and enddate is between new dates
                {$and: [
                    {start: {$gte: startDate}},
                    {until: {$lte: endDate}}
                ]}
            ]}
        ]},
        function (err, reservation) {
            if (err) return next(err);
            if (reservation !== null) {
                res.json(666, {success: false, reason: 'resource_already_booked'});
                return;
            }

            var reservation = new Reservation(req.body);

            // check if user is allowed to book that plane in that period
            User.findById(req.session.user._id, function (err, user) {
                var isAllowed = user.isAllowedToReservePlanetypeAndUntil(reservation.planetype, reservation.until);

                if (isAllowed) {
                    reservation.save(function (err, reservation) {
                        if (err) return next(err);
                        if (!reservation) return next(new Error('Failed to save reservation: ' + reservation));

                        res.json(200, reservation);
                    });
                } else {
                    res.json(666, {success: false, reason: 'license_not_valid_until'});
                }
            });

        }
    );
};

reservations.doWorkflowStep = function (req, res, next) {
    var isValidTransition,
        reservationId = req.params.id;

    if (!req.body.nextStep) {
        res.json(500, {success: false, reason: 'missing_workflow_step'});
        return;
    }

    var nextStep = req.body.nextStep;

    if (!isValidWorkflowStep(nextStep)) {
        res.json(666, {success: false, reason: 'invalid_workflow_step'});
        return;
    }

    Reservation.findById(reservationId, function (err, reservation) {
        if (err) next(err);
        if (!reservation) return next(new Error('Failed to load reservation: ' + reservation));

        isValidTransition = isValidWorkflowTransition(reservation.status, nextStep);
        if (isValidTransition !== true) {
            res.json(666, {success: false, reason: isValidTransition.reason});
            return;
        }

        reservation.status = nextStep;
        reservation.save(function (err, reservation) {
            if (err) next(err);
            if (!reservation) next(new Error('Failed to update reservation workflow: ' + reservation));

            res.json(200, reservation);
        });
    });
};

function isValidWorkflowStep(step) {
    return !!WORKFLOW.status[step];
}

function isValidWorkflowTransition(currentStep, nextStep) {
    var currentStepConfig = WORKFLOW.status[currentStep];

    if (currentStepConfig.next === false) {
        return {reason: 'no_transition_possible'};
    }

    if (util.isArray(currentStepConfig.next)) {
        if (currentStepConfig.next.indexOf(nextStep) === -1) {
            return {reason: 'transition_not_valid'};
        }
    } else {
        if (!currentStepConfig.next === nextStep) {
            return {reason: 'transition_not_valid'};
        }
    }

    return true;
}

/**
 * @route GET /
 * Sends a list of reservations
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
reservations.routes.get('/', authorization('guest'), reservations.listReservationsAsync);

reservations.routes.get('/planes', authorization('guest'), reservations.listAvailablePlanesForUserAsync);

// TODO authorization owner ! || admin
reservations.routes.put('/workflowstep/:id', authorization('user'), reservations.doWorkflowStep);


reservations.routes.post('/', authorization('user'), reservations.creatReservation);
reservations.routes.put('/', authorization('admin'), function (req, res, next) {
});
reservations.routes.delete('/', authorization('admin'), function (req, res, next) {
});