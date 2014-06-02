var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
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
