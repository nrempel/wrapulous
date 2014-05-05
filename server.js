var mongoose = require('mongoose');
var express = require('express');
var compress = require('compression');
var favicon = require('serve-favicon');
var morgan  = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var vhost = require('vhost');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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
web.use(middleware.addDate); // Adds date to every template render

if (process.env.ENVIRONMENT === 'production') {
  require('newrelic');
} else {
  server.use(errorHandler());
}

// Authentication
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Sorry, we don't recognize that username." });
      user.validPassword(password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch) return done(null, user);
        else done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

// Web routes
web.get('/', function (req, res) {
    res.render('home');
});

web.get('/docs', function (req, res) {
    res.render('docs');
});

web.get('/about', function (req, res) {
    res.render('about');
});

// AJAX routes
var ajax = require('./controllers/ajax.js');
web.post('/ajax/shorten_url/', ajax.shorten_url);

// Controllers
var linkController = require('./controllers/v0/link.js');
var eventController = require('./controllers/v0/event.js');
var trackController = require('./controllers/track.js');

// API routes
api.get('/api/v0/links', linkController.list);
api.get('/api/v0/links/:linkId', linkController.details);
api.post('/api/v0/links', linkController.create);
api.get('/api/v0/links/:linkId/events', eventController.list);
api.get('/api/v0/links/:linkId/events/:eventId', eventController.details);

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
