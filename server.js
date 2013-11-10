var mongoose = require('mongoose');
var express = require('express');

var server = module.exports = express();

// Config
var config = {
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

// Redirect www to bare domain
server.use(function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
        res.redirect(301, 'http://'+req.headers.host.replace(/^www\./, '')+req.url);
}
    else { next(); }
});

// Controllers
var appController = require('./controllers/app.js');
var linkController = require('./controllers/v0/link.js');
var eventController = require('./controllers/v0/event.js');
var trackController = require('./controllers/track.js');

// App routes
server.get('/', appController.index);
server.get('/docs', appController.docs);

// API routes
server.get('/api/v0/links', linkController.list);
server.get('/api/v0/links/:linkId', linkController.details);
server.post('/api/v0/links', linkController.create);
server.get('/api/v0/link/:linkId/events', eventController.list);
server.get('/api/v0/link/:linkId/events/:eventId', eventController.details);

// Track routes
server.get('*', trackController.handle);

// Run
server.listen(server.get('port'));
console.log('Started ' + config.name + ' on port ' + server.get('port'));
console.log('Config used: ', config);
