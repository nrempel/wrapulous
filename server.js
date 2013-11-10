var restify = require('restify');
var mongoose = require('mongoose');

var linksController = require('./controllers/links.js');
var eventsController = require('./controllers/events.js');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false }));

// Config
var config = {
    name: 'wrapulous',
    publicPath: '/public',
    viewPath: '/views',
	rootDir: __dirname,
};

// Mongoose
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/wrapulous');

// Routes
server.get('/api/v0/links', linksController.list);
server.get('/api/v0/links/:linkId', linksController.details);
server.get('/api/v0/link/:linkId/events', eventsController.list);
server.get('/api/v0/link/:linkId/events/:eventId', eventsController.details);

server.post('/api/v0/links', linksController.create);

server.listen(5000, function () {
	console.log('%s listening at %s', config.name, server.url);
});
