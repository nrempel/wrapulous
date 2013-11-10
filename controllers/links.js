var uuid = require('node-uuid');

var Link = require('../models/link.js');

// List links
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

	query = Link.find(find).sort(sort).skip(offset);
	query.exec(function (err, docs) {
		if (err) { console.log(err); }
		res.send(docs);
		return next()
	});
};

// Get link by id
exports.details = function (req, res, next) {
	var id = req.params.linkId;
	console.log(id);
	Link.findById(id, function (err, doc) {
		if (err) { console.log(err); }
		res.send(doc);
		return next()
	});
};

exports.create = function (req, res, next) {
    var link = new Link({
        unwrapped: req.body.unwrapped,
        wrapped: 'wrapulous.com/' + uuid.v1()
    })

    link.save(function (err, link) {
    	if (err) { console.log(err) };
	    res.send(link);
		return next();
    });
};

