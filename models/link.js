var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  Event = require('./event.js');

var linkSchema = new Schema({
	object: {
		type: String,
		default: 'link'
	},
	created: {
		type: Date,
		default: Date.now
	},
    destination: String,
    events: [Event.schema],
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
