var FileStreamRotator = require('file-stream-rotator');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
var moment = require('moment');
var logDirectory = path.join(__dirname, 'conf/logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
    fs.createWriteStream(logDirectory + "/access-" + moment().format("YYYYMMDD") + ".log");
}

var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan(':remote-addr | :date[web] | :req[error] | :response-time ms', {
    stream: accessLogStream
}));

app.get('/', function(req, res) {
    res.send('Good!');
});

app.all('*', function(req, res) {
    res.redirect('/');
});

app.listen(app.get('port'), function() {
    console.log('Listening on port %d', app.get('port'));
});

module.exports = app;

function server() {
    var winston = require('winston');
    var LogIO = require('log.io');
    var logging = new winston.Logger({
        transports: [new winston.transports.Console({
            level: 'error'
        })]
    });

    var conf = require('./conf/harvester.js').config;
    conf.logging = logging;

    var webConf = require('./conf/web_server.js').config;
    webConf.logging = logging;

    var logConf = require('./conf/log_server.js').config;
    logConf.logging = logging;

    var logServer = new LogIO.LogServer(logConf);
    var webServer = new LogIO.WebServer(logServer, webConf);
    webServer.run();

    var harvester = new LogIO.LogHarvester(conf);
    harvester.run();
}

server();
