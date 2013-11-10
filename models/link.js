var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var linkSchema = new Schema({
	object: {
		type: String,
		default: 'link'
	},
	created: {
		type: Date,
		default: Date.now
	},
    unwrapped: String,
    wrapped:  String,
    hash: String
});
 
module.exports = mongoose.model('Link', linkSchema);