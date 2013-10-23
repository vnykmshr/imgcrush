/**
 * ImgCrush Server
 */

var util = require('util');
var http = require('http');
var path = require('path');
var express = require('express');

var config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || config.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(express.compress());

// development only
if ('development' === app.get('env')) {
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
}

// production only
if ('production' === app.get('env')) {
  app.use(express.logger());
}

// all environments, again
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// create and start server
var server = http.createServer(app);
server.on('error', function (err) {
  util.log(err);
  process.exit(1);
});
server.listen(app.get('port'), function () {
  util.log("ImgCrush server listening on port " + app.get('port') + ' in ' + app.get('env'));
});
