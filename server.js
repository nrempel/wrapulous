var mongoose = require('mongoose');
var express = require('express');

var server = module.exports = express(); 
var web = module.exports = express();
var api = module.exports = express();
var track = module.exports = express();
var redirect = module.exports = express();

// Config
var config = {
    domain: 'wrapulous.com',
    name: 'wrapulous',
    publicPath: '/public',
    viewPath: '/views',
    rootDir: __dirname,
};

// Mongoose
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/wrapulous');

// Setup
server.set('port', process.env.PORT || 5000);
server.set('views', config.rootDir + config.viewPath);
server.set('view engine', 'jade');
server.use(express.compress());
server.use(express.favicon(config.rootDir + config.publicPath + '/favicon.ico'));
server.use(express.logger('dev'));
server.use(express.bodyParser());
server.use(express.methodOverride());
server.use(require('stylus').middleware(config.rootDir + config.publicPath));
server.use(express['static'](config.rootDir + config.publicPath));

if ('development' == server.get('env')) {
    server.use(express.errorHandler());
}

// Controllers
var appController = require('./controllers/app.js');
var linkController = require('./controllers/v0/link.js');
var eventController = require('./controllers/v0/event.js');
var trackController = require('./controllers/track.js');

// App routes
web.get('/', appController.index);
web.get('/docs', appController.docs);

// API routes
api.get('/api/v0/links', linkController.list);
api.get('/api/v0/links/:linkId', linkController.details);
api.post('/api/v0/links', linkController.create);
api.get('/api/v0/link/:linkId/events', eventController.list);
api.get('/api/v0/link/:linkId/events/:eventId', eventController.details);

// Track routes
track.get('*', trackController.handle);

// Unkown subdomain redirect
redirect.all('*', function(req, res){
  res.redirect(config.domain + server.get('port') + req.subdomains[0]);
});

// Subdomain -> express app map
server.use(express.vhost('track.' + config.domain, track));
server.use(express.vhost('api.' + config.domain, api));
server.use(express.vhost('*.' + config.domain, redirect));
server.use(express.vhost(config.domain, web)); 

// Run
server.listen(server.get('port'));
console.log('Started ' + config.name + ' on port ' + server.get('port'));
console.log('Config used: ', config);
