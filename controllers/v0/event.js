var Link = require('../../models/link.js');

exports.list = function (req, res) {

	var id = req.params.linkId;

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

	query = Link.findOne({tag: id}).sort(sort).skip(offset).limit(limit);
	query.exec(function (err, link) {
		if (err) { console.log(err); }
		res.send(link.events);
	});
};
