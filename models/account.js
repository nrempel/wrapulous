var helpers = require('../helpers.js');
var mongoose = require('mongoose');

var Link = require('./link.js');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var accountSchema = new Schema({
  id: {
    type: String,
    default: 'ac_' + helpers.generateBase62(24)
  },
  object: {
    type: String,
    default: 'account'
  },
  created: {
    type: Date,
    default: Date.now
  },
  apiKey: {
    type: String,
    default: helpers.generateBase62(24)
  }
});

// Remove meta data from toJSON
if (!accountSchema.options.toJSON) accountSchema.options.toJSON = {};
accountSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Account', accountSchema);
