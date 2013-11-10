var Event = require('../models/event.js');

exports.list = function (req, res, next) {
	return next()
}

exports.details = function (req, res, next) {
	var id = req.params.eventId;
	return next()
}