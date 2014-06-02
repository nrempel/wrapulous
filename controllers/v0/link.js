var Promise = require('bluebird');
var validator = require('validator');

var helpers = require('../helpers.js');
var Link = require('../../models/link.js');

// List links
exports.list = function (req, res) {
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

	query = Link.find().sort(sort).skip(offset).limit(limit);
	query.exec(function (err, links) {
		if (err) { console.log(err); }
		res.send(links);
	});
};

// Get link by id
exports.details = function (req, res) {
	var id = req.params.linkId;

	Link.findOne({tag: id}, function (err, link) {
		if (err) { console.log(err); }
		res.send(link);
	});
};

exports.create = function (req, res) {

	// Generate tag
	var tag = helpers.generateBase62(6);

	// Stopping condition
	var loop = true;

	// Check for uniqueness
	helpers.promiseWhile( function() {
		return loop;
	}, function () {
		return new Promise( function(resolve, reject) {
			Link.findOne({tag: tag}, function (err, link) {
				if (err) { console.log(err); }
				// If link is null then there is no collision
				if (link === null) {
					loop = false;
				} else {
					tag = helpers.generateBase62(6);
				}
				resolve();
			});
		});
	}).then( function() {

		// The requested link to shorten
		var destination = req.body.destination;

		if (!validator.isURL(destination)) {
			// The link to shorten is invalid
			res.send(400, destination + ' is not a valid URL.');
		} else {
			// It's valid
			var link = new Link({
					destination: destination,
					url: 'wrpls.com',
					tag: tag
			});

			link.save(function (err, link) {
					if (err) {
						res.send(500, err);
					} else {
						res.send(201, link);
					}
			});
		}
	});
};
