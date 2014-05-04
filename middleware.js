// Only allows Content-Type application/json
exports.defaultContentType = function (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  if (req.headers['content-type'] !== 'application/json') {
    res.send(
      400,
      'content type "application/json" expected but found "' + req.headers['content-type'] + '" instead');
  }
  else { next(); }
};

exports.addDate = function (req, res, next) {
  var date = new Date();
  var year = date.getFullYear();
  res.locals.year = year;
  next();
};

// If not authenticate, redirect to login
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) return next();
  var destination = req.url;
  res.redirect('/login?destination=' + destination);
}

// If already authenticated, redirect to dashboard
function redirectAuthenticated(req, res, next){
  if (req.isAuthenticated()) return res.redirect('/');
  next();
}
