/**
 * @class ares.server.controller.Planes
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */

var express = require('express'),
    mongoose = require('mongoose'),
    authorization = require('../middleware/authorization'),
    Plane = mongoose.model('Plane');

var planes = express.Router();
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = planes;

/**
 * @route GET /types
 * Sends a list fo plane types.
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
planes.get('/types', authorization('guest'), function (req, res, next) {
    res.json(200, [
        {
            type: 'type_01',
            name: 'P-Type 01'
        },
        {
            type: 'type_02',
            name: 'P-Type 02'
        },
        {
            type: 'type_03',
            name: 'P-Type 03'
        }
    ])
});

/**
 * @route GET /
 * Sends a list of planes
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
planes.get('/', authorization('guest'), function (req, res, next) {
    Plane.find({}, function (err, plane) {
        if (err) next(err);

        //res.json('200', user);
        res.json({ // TODO util!
            success: true,
            total: plane.length,
            records: plane
        });
    });
});

/**
 * @route GET /:id
 * Sends a plane by id.
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
planes.get('/:id', authorization('guest'), function (req, res, next) {
    res.send(200, 'get plane by id: ' + req.params.id);
});

/**
 * @route POST /
 * Creates a plane.
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 */
planes.post('/', authorization('admin'), function (req, res, next) {
    var plane = new Plane(req.body);

    plane.save(function (err, plane) {
        if (err) next(err);
        if (!plane) next(new Error('Failed to save plane: ' + plane));

        res.json(200, plane);
    });
});

/**
 * @route PUT /:id
 * Updates a plane by id.
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 */
planes.put('/:id', authorization('admin'), function (req, res, next) {
    var planeId = req.params.id;

    Plane.findById(planeId, function (err, plane) {
        if (err) next(err);
        if (!plane) next(new Error('Failed to update plane: ' + plane));

        plane.set(req.body);
        plane.save(function (err) {
            if (err) next(err);
            if (!plane) next(new Error('Failed to update plane: ' + plane));

            res.json(200, plane);
        });
    });
});

/**
 * @route Delete /:id
 * Deletes a plane
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 */
planes.delete('/:id', authorization('admin'), function (req, res, next) {
    var planeId = req.params.id;

    Plane.findByIdAndRemove(planeId, function (err) {
        if (err) next(err);

        res.json(200, {success: true});
    });
});