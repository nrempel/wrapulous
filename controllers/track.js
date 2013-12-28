var url = require('url');

var Link = require('../models/link.js');

// Get link by id
exports.handle = function (req, res) {
	var tag = req.originalUrl.slice(1, req.originalUrl.length);

	Link.findOne({ tag: tag }, function (err, doc) {
		if (err || doc === null) {
			res.redirect('/');
		}
		else {
			//TODO tracking stuff
			destination = doc.destination;
			// Make sure we have an absolute uri... default to http
			if (doc.destination.match(/^http:\/\//) === null) {
				destination = 'http://' + destination;
			}
			res.redirect(302, destination);
		}
	});
};
