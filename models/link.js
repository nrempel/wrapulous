var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Event = require('./event.js');
var helpers = require('../helpers.js');

var linkSchema = new Schema({
  account: String,
  id: {
    type: String,
    default: 'li_' + helpers.generateBase62(24)
  },
	object: {
		type: String,
		default: 'link'
	},
	created: {
		type: Date,
		default: Date.now
	},
  destination: String,
  url:  String,
  tag: String
});

// Remove meta data from toJSON
if (!linkSchema.options.toJSON) linkSchema.options.toJSON = {};
linkSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Link', linkSchema);
