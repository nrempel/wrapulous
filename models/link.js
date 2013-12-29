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

module.exports = mongoose.model('Link', linkSchema);