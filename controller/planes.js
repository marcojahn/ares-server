var express = require('express');

var planes = express.Router();
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = planes;

planes.get('/', function (req, res, next) {
    //res.send('200', 'get all the planes 3');
    res.json(200, {
        success: true,
        total: 2,
        records: [
            {id: 1, name: 'aircraft 1'},
            {id: 2, name: 'aircraft 2'}
        ]
    });
});

planes.get('/:id', function (req, res, next) {
    res.send(200, 'get plane by id: ' + req.params.id);
});