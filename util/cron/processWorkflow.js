var util = require('util'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    reservationModel = require('../../model/reservation');
    Reservation = mongoose.model('Reservation');

exports.returnLent = function () {
    console.log('return lent planes: ' + new Date());

    Reservation.update(
        {
            status: {$in: ['reserved', 'lent']},
            until: {$lt: moment()}
        },
        {$set: {status: 'returned'}},
        {multi: true},
        function (err, numberAffected, raw) {
            if (err) console.log(err);
            console.log('The number of updated documents was %d', numberAffected);
            //console.log('The raw response from Mongo was ', raw);
        }
    )
};