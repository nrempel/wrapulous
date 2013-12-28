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

			console.log(doc);


			res.redirect(302, doc.destination);
		}
	});
};
