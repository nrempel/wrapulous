var bases = require('bases');
var crypto = require('crypto');
 
exports.generateBase62 = function (length) {
    var maxNum = Math.pow(62, length);
    var numBytes = Math.ceil(Math.log(maxNum) / Math.log(256));
    console.log(numBytes);
    if (numBytes === Infinity) {
        throw new Error('Length too large; caused overflow: ' + length);
    }

    do {
        var bytes = crypto.randomBytes(numBytes);
        var num = 0
        for (var i = 0; i < bytes.length; i++) {
            num += Math.pow(256, i) * bytes[i];
        }
    } while (num >= maxNum);

    return bases.toBase62(num);
};
