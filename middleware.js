var Account = require('./models/account.js');

// Only allows Content-Type application/json
exports.defaultContentType = function (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  if (req.headers['content-type'] !== 'application/json') {
    res.send(
      400,
      'Content type "application/json" expected but found "' + req.headers['content-type'] + '" instead');
  }
  else { next(); }
};

// Add a date for all render calls
exports.addDate = function (req, res, next) {
  var date = new Date();
  var year = date.getFullYear();
  res.locals.year = year;
  next();
};

exports.attachApiKey = function (req, res, next) {
  // Get the api key...

  console.log(req.headers);

  var header=req.headers.authorization || '', // get the header
      token=header.split(/\s+/).pop() || '', // and the encoded auth token
      auth=new Buffer(token, 'base64').toString(), // convert from base64
      parts=auth.split(/:/), // split on colon
      apiKey=parts[0];

  Account.findOne({apiKey: apiKey}, function(err, account) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      if (account) {
        req.account = account;
      }
      next();
    }
  });
};

// Ensure api key is passed in http basic auth username
exports.requireAuthentication = function (req, res, next) {
  if (!req.account) {
    res.send(
      401,
      'An API key is required to do that.');
  } else {
    next();
  }
};
