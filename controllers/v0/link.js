var helpers = require('../helpers.js');
var Link = require('../../models/link.js');

// List links
exports.list = function (req, res) {
	var limit = Number(req.query.limit) || 10;
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

	query = Link.find().sort(sort).skip(offset).limit(limit);
	query.exec(function (err, docs) {
		if (err) { console.log(err); }
		res.send(docs);
	});
};

// Get link by id
exports.details = function (req, res) {
	var id = req.params.linkId;

	Link.findById(id, function (err, doc) {
		if (err) { console.log(err); }
		res.send(doc);
	});
};

exports.create = function (req, res) {

	var tag = helpers.generateBase62(5);
	var destination = req.body.destination;

    console.log(req.body);

    var link = new Link({
        destination: destination,
        domain: 'wrapulous.com', // Eventually we use cool mini domains
        tag: tag
    });

    link.save(function (err, link) {
        if (err) { console.log(err); }
        res.send(link);
    });
};

