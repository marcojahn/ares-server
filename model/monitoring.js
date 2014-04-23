var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var MonitoringSchema = new Schema({
    created: {type: Date, index: true, default: new Date},
    method: {type: String, required: true, index: true}, // GET, POST, ...
    url: {type: String, required: true, index: true}, // e.g. /users
    parameter: Object,
    status: Number,
    reason: Object,
    duration: {type: Number, required: true, index: true} // in ms
});

module.exports = mongoose.model('Monitoring', MonitoringSchema);