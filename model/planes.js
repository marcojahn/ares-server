var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePluginDocumentTimestamps = require('../util/mongoose/plugins/documenttimestamps');

var PlaneSchema = new Schema({
    plane: {type: String, required: true, index: {unique: true}},
    planetype: {type: String, required: true, index: true}
});

PlaneSchema.plugin(mongoosePluginDocumentTimestamps);
module.exports = mongoose.model('Plane', PlaneSchema);