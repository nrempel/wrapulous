var Event = require('../../models/event.js');
var Link = require('../../models/link.js');

exports.list = function (req, res) {

	var id = req.params.linkId;
	var apiKey = req.apiKey;

	var limit = Number(req.query.limit) || 100;
	var offset = Number(req.query.offset) || 0;
	var sortBy = req.query.sortBy || 'created';
	var sortOrder = Number(req.query.sortOrder) || -1;

	// Restrict limit range
	limit = Math.min(limit, 100);
	limit = Math.max(limit, 0);

	// Format and validate sort
	var sort = {};
	sort[sortBy] = sortOrder;
	// Only accept -1, 1
	if (!(sort[sortBy] in [-1, 1])) {
		sort[sortBy] = -1;
	}

	// Get link
	Link.findOne({tag: id, account: req.account.id}, function(err, link) {
		if (err) {
			console.log(err);
			res.send(500);
		} else {
			// Get events
			query = Event.find({link: link.id})
				.sort(sort).skip(offset)
				.limit(limit);
			query.exec(function (err, events) {
				if (err) {
					console.log(err);
					res.send(500);
				} else {
					res.send(events);
				}
			});
		}
	});
};
