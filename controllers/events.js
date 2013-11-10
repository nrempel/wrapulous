var Event = require('../models/event.js');

exports.list = function (req, res, next) {
	var count = Number(req.query.count) || 100;
	var offset = Number(req.query.offset) || 0;
	var sortBy = String(req.query.sortBy) || 'created';
	var sortOrder = Number(req.query.sortOrder) || -1;

	var sort = {
		sortBy: sortOrder
	};

	// Only accept -1, 1
	if (!(sort[sortBy] in [-1, 1])) {
		sort[sortBy] = -1;
	}

	var find = {
		count: count,
		offset: offset
	};

	query = Event.find(find).sort(sort).skip(offset);
	query.exec(function (err, docs) {
		if (err) { console.log(err); }
		res.send(docs);
		return next()
	});
}

exports.details = function (req, res, next) {
	var id = req.params.linkId;
	Link.findById(id, function (err, doc) {
		if (err) { console.log(err); }
		res.send(doc);
		return next()
	});
}