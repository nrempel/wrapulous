var request = require('request');

exports.shorten_url = function (request, response) {
  var url = request.body.destination;
  var request_json = JSON.stringify({
    destination: url
  });

  request.post({
    url: 'http://api.wrapulous.com/api/v0/links/',
    body: request_json
  }, function (error, response, body) {
    console.log(error);
    console.log(response);
    console.log(body);
  });


};
