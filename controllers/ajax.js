var request = require('request');

exports.shorten_url = function (req, res) {
  var url = req.body.destination;
  var request_json = JSON.stringify({
    destination: url
  });

  request.post({
    url: 'http://api.wrapulous.com/api/v0/links/',
    json: request_json
  }, function (err, res, body) {
    console.log();
  });


};