var FileStreamRotator = require('file-stream-rotator');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
var logDirectory = path.join(__dirname, 'logs');

if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
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
    winston = require('winston');
    logging = new winston.Logger({
      transports: [ new winston.transports.Console({
        level: 'error'
      })]
    });

    conf = require('./conf/harvester.conf').config;
    conf.logging = logging;

    var harvester = require('./node_modules/log.io/index.js');
    harvester = new harvester.LogHarvester(conf);
    harvester.run();

    webConf = require('./conf/web_server.conf').config;
    webConf.logging = logging;

    logConf = require('./conf/log_server.conf').config;
    logConf.logging = logging;

    var server = require('./node_modules/log.io/index.js');

    logServer = new server.LogServer(logConf);
    webServer = new server.WebServer(logServer, webConf);
    webServer.run();
}

server();
