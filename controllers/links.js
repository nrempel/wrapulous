var Link = require('../models/link.js');

exports.list = function (req, res, next) {
	return next()
}

exports.details = function (req, res, next) {
	var id = req.params.linkId;
	return next()
}
