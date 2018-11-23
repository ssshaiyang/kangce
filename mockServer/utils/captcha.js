let captchapng = require('captchapng');

module.exports = function createCaptcha() {
    let p = new captchapng(120, 30, parseInt(Math.random() * 9000 + 1000));
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    let img = p.getBase64();
    // return 'data:image/png;base64,' + img
    return new Buffer(img, 'base64');
}