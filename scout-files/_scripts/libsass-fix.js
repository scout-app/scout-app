/* eslint-disable no-console */

/*
    When you do npm install, libsass will download the version that matches
    your OS and Node Version. Since NW.js has a different version of Node
    built-in than what you have installed, it needs a different version of
    libsass.

    We include the correct version from each OS in the _assets folder. On
    page load, if the correct version of libsass is not installed, we
    copy it from the _assets folder to the correct location, then refresh
    the app automatically.

    This is for development only, as the dist version of Scout-App, will
    come with the correct libsass version out of the box. So this script
    will not be needed.
*/

(function (ugui) {

    // Allow access to the filesystem
    var fs = require('fs-extra');

    // The Node Sass Vendor folder is our Destination
    var nsPath = 'node_modules/node-sass';
    var nsVer = '3.8.0';

    // Check to see if there is an existing Vendor folder
    var nsContents = ugui.helpers.readAFolder(nsPath);
    var vendorFolder = false;

    for (var h = 0; h < nsContents.length; h++) {
        if (nsContents[h].name.toLowerCase() == 'vendor') {
            vendorFolder = true;
        }
    }

    // The Node Sass Vendor folder is our Destination
    var nsVenDestinationPath = 'node_modules/node-sass/vendor';

    if (!vendorFolder) {
        ugui.helpers.createAFolder(nsVenDestinationPath);
    }

    // Read the contents of the folder
    ugui.helpers.readAFolder(nsVenDestinationPath, function (contents) {
        var win = require('nw.gui').Window.get();
        // If there are no folders or the existing folder is not the right version
        if (contents.length == 0 || (contents.length == 1 && contents[0].name.split('-')[2] !== '43')) {
            var os = process.platform;
            var arch = process.arch;
            // Verify the machine is 32 or 64-Bit
            if (arch == 'x64' || arch == 'ia32') {
                // 32-Bit OSX is unsupported
                if (os == 'darwin' && arch == 'ia32') {
                    console.log('Node-Sass does not support OSX 32-Bit');
                    win.showDevTools();
                // If the OS and Architecture are supported
                } else if (os == 'darwin' || os == 'freebsd' || os == 'linux' || os == 'win32') {
                    // Set the source path
                    var nsVenSourcePath = 'scout-files/_assets/node-sass_v' + nsVer;
                    var folderName = '/' + os + '-' + arch + '-43';
                    var file = '/binding.node';
                    var nsVenSource = nsVenSourcePath + folderName + file;
                    var nsVenDestination = nsVenDestinationPath + folderName + file;
                    // Creat a folder in the Dest with the correct name
                    ugui.helpers.createAFolder(nsVenDestinationPath + folderName, function () {
                        // copy source to dest
                        fs.copy(nsVenSource, nsVenDestination, function (err) {
                            if (err) {
                                console.log('Error attempting to copy LibSass bindings');
                                console.log(err);
                                win.showDevTools();
                            } else {
                                win.reloadIgnoringCache();
                            }
                        });
                    });
                } else {
                    console.log('Your OS is not supported by Node-Sass');
                    win.showDevTools();
                }
            } else {
                console.log('Node-Sass only supports ia32 and x64 (32-Bit and 64-Bit) computers.');
                console.log('You have: ' + arch);
                win.showDevTools();
            }

        }
    });

    // Make sure there is only one `css3-mixins.s*ss`
    var css3 = 'bower_components/sass-css3-mixins/css3-mixins.scss';
    fs.stat(css3, function (err, stats) {
        if (!err && stats.size > 0) {
            ugui.helpers.deleteAFile(css3);
        }
    });

})(window.ugui);
