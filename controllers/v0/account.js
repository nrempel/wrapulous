var Account = require('../../models/account.js');

exports.create = function (req, res) {

  var account = new Account();
  account.save(function (err, account) {
    if (err) {
      res.send(500, err);
    } else {
      res.send(201, account);
    }
  });

};
