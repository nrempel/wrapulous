var url = require('url');

var Link = require('../models/link.js');

// Get link by id
exports.handle = function (req, res) {
	var hash = req.originalUrl.slice(1, req.originalUrl.length);
	Link.findOne({ hash: hash }, function (err, doc) {
		if (err || doc === null) {
			res.redirect('/');
		}
		else {
			//TODO tracking stuff
			res.redirect(302, doc.unwrapped);
		}
	});
};
