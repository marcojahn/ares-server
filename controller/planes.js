/**
 * @class ares.server.controller.Planes
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */

var express = require('express'),
    mongoose = require('mongoose'),
    authorization = require('../middleware/authorization'),
    Plane = mongoose.model('Plane');

var planes = {};
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = planes;
planes.routes = express.Router();

planes.listPlanetypes = function (req, res, next) {
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
};

planes.listPlanes = function (req, res, next) {
    Plane.find({}, function (err, plane) {
        if (err) next(err);

        //res.json('200', user);
        res.json({ // TODO util!
            success: true,
            total: plane.length,
            records: plane
        });
    });
};

planes.getPlaneById = function (req, res, next) {
    res.send(200, 'get plane by id: ' + req.params.id);
};

planes.createPlane = function (req, res, next) {
    var plane = new Plane(req.body);

    plane.save(function (err, plane) {
        if (err) next(err);
        if (!plane) next(new Error('Failed to save plane: ' + plane));

        res.json(200, plane);
    });
};

planes.updatePlane = function (req, res, next) {
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
};

planes.deletePlane = function (req, res, next) {
    var planeId = req.params.id;

    Plane.findByIdAndRemove(planeId, function (err) {
        if (err) next(err);

        res.json(200, {success: true});
    });
};

/**
 * @route GET /types
 * Sends a list fo plane types.
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
planes.routes.get('/types', authorization('guest'), planes.listPlanetypes);

/**
 * @route GET /
 * Sends a list of planes
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
planes.routes.get('/', authorization('guest'), planes.listPlanes);

/**
 * @route GET /:id
 * Sends a plane by id.
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
planes.routes.get('/:id', authorization('guest'), planes.getPlaneById);

/**
 * @route POST /
 * Creates a plane.
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 */
planes.routes.post('/', authorization('admin'), planes.createPlane);

/**
 * @route PUT /:id
 * Updates a plane by id.
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 */
planes.routes.put('/:id', authorization('admin'), planes.updatePlane);

/**
 * @route Delete /:id
 * Deletes a plane
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 */
planes.routes.delete('/:id', authorization('admin'), planes.deletePlane);