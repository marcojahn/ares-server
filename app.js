var config = require('./config/config');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var later = require('later');
var workflow = require('./util/cron/processWorkflow');


// TODO refactor
// bootstrap db connection
mongoose.connect(config.db);
// bootstrap models
var models_path = __dirname + '/model';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file)
});

// configuration
require('./config/express')(app, config);

// load routes
require('./config/routes')(app);


app.listen(config.port);

// todo make hübsch
var schedule = later.parse.text('every 30 seconds');
var cron = later.setInterval(workflow.returnLent, schedule);

console.log('up and running'); // todo instrumtalise a logging framework