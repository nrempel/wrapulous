var request = require('request');

exports.shorten_url = function (req, res) {
  var url = req.body.destination;
  request.post({
    url: 'http://api.wrapulous.com/api/v0/links/',
    json: {destination: url}
  }, function (error, response, body) {

    console.log(response);

    res.send(
      response.statusCode,
      {
        body: body,
        apiKey: response.headers['X-Api-Key']
      }
    );
  });
};
