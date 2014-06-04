var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var helpers = require('../helpers.js');

var eventSchema = new Schema({
  link: String,
  id: {
    type: String,
    default: 'ev_' + helpers.generateBase62(24)
  },
  object: {
		type: String,
		default: 'event'
	},
	created: {
		type: Date,
		default: Date.now
	},
  type: String,
  userAgent: String,
  remoteAddress: String
});

// Remove meta data from toJSON
if (!eventSchema.options.toJSON) eventSchema.options.toJSON = {};
eventSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Event', eventSchema);
