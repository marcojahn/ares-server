var express = require('express'),
    mongoose = require('mongoose'),
    Plane = mongoose.model('Plane');

var planes = express.Router();
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = planes;

// TODO placeholder, remove after fully implemented
var authorize = function () {
    return function (req, res, next) {
        next();
    };
};

planes.get('/types', function (req, res, next) {
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

planes.get('/', function (req, res, next) {
    Plane.find({}, function (err, plane) {
        if (err) console.log(err);

        //res.json('200', user);
        res.json({ // TODO util!
            success: true,
            total: plane.length,
            records: plane
        });
    });
});

planes.get('/:id', function (req, res, next) {
    res.send(200, 'get plane by id: ' + req.params.id);
});

planes.post('/', function (req, res, next) {
    var plane = new Plane(req.body);

    plane.save(function (err, plane) {
        // TODO
        if (err) console.log(err);
        if (!plane) console.log(new Error('Failed to save plane: ' + plane));

        res.json(200, plane);
    });
});

planes.put('/:id', function (req, res, next) {
    var planeId = req.params.id;

    Plane.findById(planeId, function (err, plane) {
        if (err) console.log(err);
        if (!plane) console.log(new Error('Failed to update plane: ' + plane));

        plane.set(req.body);
        plane.save(function (err) {
            if (err) console.log(err);
            if (!plane) console.log(new Error('Failed to update plane: ' + plane));

            res.json(200, plane);
        });
    });
});

planes.delete('/:id', authorize('role:admin'), function (req, res, next) {
    var planeId = req.params.id;

    Plane.findByIdAndRemove(planeId, function (err) {
        if (err) console.log(err);

        res.json(200, {success: true});
    });
});