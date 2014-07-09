var fs = require('fs');
var mongoose = require('mongoose');
var express = require('express');
var compress = require('compression');
var favicon = require('serve-favicon');
var morgan  = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var marked = require('marked');
var vhost = require('vhost');
var middleware = require('./middleware.js');

var server = module.exports = express();
var web = module.exports = express();
var api = module.exports = express();
var track = module.exports = express();

// Config
var config = {
  domain: 'wrapulous.com',
  name: 'wrapulous',
  publicPath: '/public',
  viewPath: '/views',
  rootDir: __dirname,
};

// Mongoose
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/wrapulous');

// Setup
server.set('port', process.env.PORT || 5000);
web.set('views', config.rootDir + config.viewPath);
web.set('view engine', 'jade');
web.use(compress());
web.use(favicon(config.rootDir + config.publicPath + '/favicon.ico'));
server.use(morgan('dev'));
server.use(bodyParser());
server.use(methodOverride());
web.use(require('stylus').middleware(config.rootDir + config.publicPath));
web.use(express.static(config.rootDir + config.publicPath));
api.use(middleware.defaultContentType); // Forces application/json
api.use(middleware.attachApiKey);
web.use(middleware.addDate); // Adds date to every template render

// Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


if (process.env.ENVIRONMENT === 'production') {
  require('newrelic');
} else {
  server.use(errorHandler());
}

// Web routes
web.get('/', function (req, res) {
  res.render('home');
});

web.get('/docs', function (req, res) {
  res.render('docs/overview');
});

web.get('/docs/accounts', function (req, res) {
  res.render('docs/accounts');
});

web.get('/docs/links', function (req, res) {
  res.render('docs/links');
});

web.get('/docs/events', function (req, res) {
  res.render('docs/events');
});

web.get('/about', function (req, res) {
  res.render('about');
});

web.get('*', function (req, res) {
  res.render('404', { status: 404, url: req.url });
});

// AJAX routes
var ajax = require('./controllers/ajax.js');
web.post('/ajax/shorten_url/', ajax.shorten_url);

// Controllers
var accountController = require('./controllers/v0/account.js');
var linkController = require('./controllers/v0/link.js');
var eventController = require('./controllers/v0/event.js');
var trackController = require('./controllers/track.js');

// API routes

api.post(
  '/v0/accounts',
  accountController.create
);

api.get(
  '/v0/links',
  middleware.requireAuthentication,
  linkController.list
);

api.get(
  '/v0/links/:linkId',
  middleware.requireAuthentication,
  linkController.details
);

api.post(
  '/v0/links',
  linkController.create
);

api.get(
  '/v0/links/:linkId/events',
  middleware.requireAuthentication,
  eventController.list
);

// Track routes
track.get('*', trackController.handle);

// Subdomain -> express app map
if (process.env.ENVIRONMENT === 'production') {
  server.use(vhost('wrpls.com', track));
  server.use(vhost('track.' + config.domain, track));
  server.use(vhost('api.' + config.domain, api));
  server.use(vhost(config.domain, web));
} else {
  server.use(vhost('localhost', api));
  server.use(vhost('localhost', web));
  server.use(vhost('localhost', track));
}

// Run
server.listen(server.get('port'));
console.log('Started ' + config.name + ' on port ' + server.get('port'));
console.log('Config used: ', config);
