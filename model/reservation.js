var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePluginDocumentTimestamps = require('../util/mongoose/plugins/documenttimestamps');

// TODO user refs !!
// http://mongoosejs.com/docs/populate.html

// planetype use ENUM as used for client
// definition: controller/planes.js#22
// Move to config
// http://mongoosejs.com/docs/api.html#schema_string_SchemaString-enum
var ReservationSchema = new Schema({
    plane: {type: String, required: true, index: {unique: true}},
    status: {type: String, required: true, index: true, default: 'reserved'}, // TODO use config
    from: {type: Date, required: true, index: true},
    to: {type: Date, required: true, index: true},
    by: {type: String, required: true, index: true}
});

ReservationSchema.plugin(mongoosePluginDocumentTimestamps);
module.exports = mongoose.model('Reservation', ReservationSchema);