var mongoose = require('mongoose');
var express = require('express');

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

console.log( server.get('env') || 'not');

// Mongoose
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/wrapulous');

// Setup
server.set('port', process.env.PORT || 6000);
web.set('views', config.rootDir + config.viewPath);
web.set('view engine', 'jade');
web.use(express.compress());
web.use(express.favicon(config.rootDir + config.publicPath + '/favicon.ico'));
server.use(express.logger('dev'));
server.use(express.bodyParser());
server.use(express.methodOverride());
web.use(require('stylus').middleware(config.rootDir + config.publicPath));
web.use(express.static(config.rootDir + config.publicPath));
api.use(require('./middleware.js').defaultContentType); // Forces application/json

if ('development' == server.get('env')) {
    server.use(express.errorHandler());
} else {
    require('newrelic');
}

// Web routes
web.get('/', function (req, res) {
    var date = new Date();
    var year = date.getFullYear();
    res.render('index', {year: year});
});

web.get('/docs', function (req, res) {
    res.render('docs');
});

// Controllers
var linkController = require('./controllers/v0/link.js');
var eventController = require('./controllers/v0/event.js');
var trackController = require('./controllers/track.js');

// API routes
api.get('/api/v0/links', linkController.list);
api.get('/api/v0/links/:linkId', linkController.details);
api.post('/api/v0/links', linkController.create);
api.get('/api/v0/link/:linkId/events', eventController.list);
api.get('/api/v0/link/:linkId/events/:eventId', eventController.details);

// Track routes
track.get('*', trackController.handle);

// Subdomain -> express app map
if ('development' == server.get('env')) {
    server.use(express.vhost('localhost', api));
    server.use(express.vhost('localhost', web));
    server.use(express.vhost('localhost', track));
} else {
    server.use(express.vhost('track.' + config.domain, track));
    server.use(express.vhost('api.' + config.domain, api));
    server.use(express.vhost(config.domain, web));
}

// Run
server.listen(server.get('port'));
console.log('Started ' + config.name + ' on port ' + server.get('port'));
console.log('Config used: ', config);
