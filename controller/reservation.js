/**
 * @class ares.server.controller.Reservation
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */
var util = require('util'),
    express = require('express'),
    mongoose = require('mongoose'),
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

// TODO planes mit status
// - xy -> alle flugzeuge mit status xy
// - [none] alle flugzeuge ohne status (frei)
// wir arbeiten hier nur auf "aktiven" oder "freien" flugzeugen!

reservations.listReservations = function (req, res, next) {
    var match = {$match: {url: req.query.status}};

    Reservation.find({}, function (err, reservation) {
        if (err) return next(err);

        res.json({ // TODO util!
            success: true,
            total: reservation.length,
            records: reservation
        });
    });
};

reservations.listAvailablePlanesForUser = function (req, res, next) {
    // todo handle failures!

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
            res.json({ // TODO util!
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

    var reservation = new Reservation(req.body);

    // TODO
    // check if plane is not reserved in that slot
//    var startDate = ISODate("2014-06-29T00:00:00.000Z");
//    var endDate = ISODate("2014-06-30T00:00:00.000Z");
//    db.reservations.find(
//        {$and: [
//            {planetype: 'type_01'},
//            {$or: [
//                // existing startdate in new range
//                {start: {$gte: startDate, $lte: endDate}},
//
//                // existing enddate in new range
//                {until: {$gte: startDate, $lte: endDate}},
//
//                // new range is between existing startdate and enddate
//                {$and: [
//                    {start: {$lte: startDate}},
//                    {until: {$gte: endDate}}
//                ]},
//
//                // existing startdate and enddate is between new dates
//                {$and: [
//                    {start: {$gte: startDate}},
//                    {until: {$lte: endDate}}
//                ]}
//            ]}
//        ]}
//    )

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

        // TODO load reservationItem and check if transition is valid
        isValidTransition = isValidWorkflowTransition(reservation.status, nextStep);
        if (isValidTransition !== true) {
            res.json(666, {success: false, reason: isValidTransition.reason});
            return;
        }

        reservation.status = nextStep;
        reservation.save(function (err, reservation) {
            if (err) next(err);
            if (!reservation) return next(new Error('Failed to update reservation workflow: ' + reservation));

            res.json(200, reservation);
        });
    });
};

function isValidWorkflowStep (step) {
    return !!WORKFLOW.status[step];
}

function isValidWorkflowTransition (currentStep, nextStep) {
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
reservations.routes.get('/', authorization('guest'), reservations.listReservations);

reservations.routes.get('/planes', authorization('guest'), reservations.listAvailablePlanesForUser);

// TODO authorization owner ! || admin
reservations.routes.put('/workflowstep/:id', authorization('user'), reservations.doWorkflowStep);


reservations.routes.post('/', authorization('user'), reservations.creatReservation);
reservations.routes.put('/', authorization('admin'), function (req, res, next) {});
reservations.routes.delete('/', authorization('admin'), function (req, res, next) {});