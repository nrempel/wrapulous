var restify = require('restify');
var mongoose = require('mongoose');

var linksController = require('./controllers/links.js');
var eventsController = require('./controllers/events.js');

var server = restify.createServer();

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
server.get('/links', linksController.list);
server.get('/links/:linkId', linksController.details);
server.get('/link/:linkId/events', eventsController.list);
server.get('/link/:linkId/events/:eventId', eventsController.details);

server.listen(5000, function () {
	console.log(server);
	console.log('%s listening at %s', config.name, server.url);
});
