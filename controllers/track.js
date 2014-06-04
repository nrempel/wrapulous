var url = require('url');

var Link = require('../models/link.js'),
	Event = require('../models/event.js');

// Get link by id
exports.handle = function (req, res) {
	var tag = req.originalUrl.slice(1, req.originalUrl.length);
	Link.findOne({ tag: tag }, function (err, link) {
		if (err || link === null) {
			res.redirect('/');
		}
		else {
			// Generate new event
			var event = new Event({
				link: link.id,
				type: 'click',
				userAgent: req.headers['user-agent'],
				remoteAddress: req.__remoteAddress
			});
			event.save();

			// Redirect
			destination = link.destination;
			// Make sure we have an absolute uri... default to http
			if (link.destination.match(/^http:\/\//) === null) {
				destination = 'http://' + destination;
			}
			res.redirect(302, destination);
		}
	});
};
