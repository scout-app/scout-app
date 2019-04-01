function takeScreenshot () {
    var fs = require('fs');
    var path = require('path');
    var nw = require('nw.gui');
    var win = nw.Window.get();

    var height = $('body').outerHeight();
    var width = $('body').outerWidth();
    win.resizeTo(width, height);

    // Wait for the window to finish resizing before taking the screenshot.
    setTimeout(function () {
        win.capturePage(function (img) {
            var base64Data = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            fs.writeFile(path.join(process.env.USERPROFILE, 'Desktop', 'screenshot.png'), base64Data, 'base64', function (err) {
                if (err) {
                    console.warn(err);
                }
            });
        }, 'png');
    }, 500);
}
