// Monitoring
//require('newrelic');
/*require('nodetime').profile({
    accountKey: '655ca0ab8c053925e8b4ee0ff4818d37a3836fe7',
    appName: 'ARES'
});*/

var config = require('./config/config');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var later = require('later');
var workflow = require('./util/cron/processWorkflow');


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

var schedule = later.parse.text('every 30 seconds');
var cron = later.setInterval(workflow.returnLent, schedule);

console.log('up and running');