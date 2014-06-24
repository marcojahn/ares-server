var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema,
    mongoosePluginDocumentTimestamps = require('../util/mongoose/plugins/documenttimestamps');

var untilDateIsBeforeStartDate = [
    function (val) {
        return moment(val).isAfter(this.start);
    },
    'Until date must be before start date',
];

var startDateMustBeGreaterThanNow = [
    function (val) {
        return moment(val).isAfter();
    },
    'Start date must not be in the past'
];

var ReservationSchema = new Schema({
    plane: {type: String, required: true, index: true},
    planetype: {type: String, required: true, index: true},
    status: {type: String, required: true, index: true, default: 'reserved'}, // TODO use config
    start: {type: Date, required: true, index: true, validate: startDateMustBeGreaterThanNow},
    until: {type: Date, required: true, index: true, validate: untilDateIsBeforeStartDate},
    by: {type: String, required: true, index: true}
});

ReservationSchema.plugin(mongoosePluginDocumentTimestamps);
module.exports = mongoose.model('Reservation', ReservationSchema);