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

eventSchema.methods.toJSON = function() {
  obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};


module.exports = mongoose.model('Event', eventSchema);