// Only allows Content-Type application/json
exports.defaultContentType = function (req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    if (req.headers['content-type'] !== 'application/json') {
        res.send(
            400,
            'content type "application/json" expected but found "'+ req.headers['content-type'] + '" instead');
    } else {
        next();
    }
};