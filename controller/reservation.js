/**
 * @class ares.server.controller.Reservation
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */
var express = require('express'),
    mongoose = require('mongoose'),
    authorization = require('../middleware/authorization'),
    User = mongoose.model('User'),
    Reservation = mongoose.model('Reservation');

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
    // gather license informations
    User.findById(req.session.user._id, function (err, user) {
        if (err) next(err);

        var userLicenses = user.licenses; // TODO getValidLicenses() in user model

        res.json({ // TODO util!
            success: true,
            total: [].length,
            records: []
        });
    });
    /*
     db.users.find({$and: [
     {"licenses.planetype": "type_01"},
     {"licenses.validUntil": {$gte : new Date()}}
     ]})

     licenseInfos aus dem array lesen, gültige lizenzen weiter verarbeiten
     */

    // restrict planes to a list of planes a user is allowed to reserve
    //db.planes.find({planetype: {$in: ['type_01']}})


};

/**
 * @route GET /
 * Sends a list of reservations
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
reservations.routes.get('/', authorization('guest'), reservations.listReservations);

reservations.routes.get('/planes', authorization('guest'), reservations.listAvailablePlanesForUser);

// TODO authorization owner ! || admin
reservations.routes.put('/workflowstep', authorization('user'), function (req, res, next) {
    // TODO use (same?) config as in client config
});
reservations.routes.post('/', authorization('user'), function (req, res, next) {});
reservations.routes.put('/', authorization('user'), function (req, res, next) {});
reservations.routes.delete('/', authorization('user'), function (req, res, next) {});