/* eslint-disable no-console */

/*
    When you do npm install, libsass will download Node-Sass bindings that
    match against your OS and globally installed Node version. Since NW.js
    has a different version of Node built-in than what you have installed
    globally, it needs a different version of the libsass node bindings.

    We check for the latest release of the node-sass that has bindings for
    all of Scout-App's targeted platforms. Then we download the correct
    bindings for you OS, Arch, and the NW.js Node version, and delete
    bindings that are not used by Scout-App.
*/

var https = require('https');
var fs = require('fs-extra');
var path = require('path');
var url = require('url');

var validAssets = {
    'darwin-x64-43_binding.node': '',
    'linux-ia32-43_binding.node': '',
    'linux-x64-43_binding.node': '',
    'win32-ia32-43_binding.node': '',
    'win32-x64-43_binding.node': ''
};
var bindingsTotal = Object.keys(validAssets).length;

// check if the file is already downloaded
// create directory to store file if it does not exist
// return bool so other functions can bail if file already downloaded
function fileAlreadyDownloaded (binding) {
    var directory = path.join('.', 'node_modules', 'node-sass', 'vendor', binding);
    fs.ensureDirSync(directory);
    var destination = path.join(directory, 'binding.node');
    if (fs.existsSync(destination)) {
        return true;
    }
    return false;
}

// Loop over all items in the node-sass/vendor folder
// loop over the keys of validAssets
// If the item in the folder is not a valid asset, delete it
function deleteOldBindings () {
    var directory = path.join('.', 'node_modules', 'node-sass', 'vendor');
    var vendors = fs.readdirSync(directory);
    vendors.forEach(function (vendor) {
        var isValid = false;

        for (var binding in validAssets) {
            if (vendor + '_binding.node' === binding) {
                isValid = true;
            }
        }

        if (!isValid) {
            fs.removeSync(path.join(directory, vendor));
        }
    });
}

// Actually downloadsthe binding to the correct folder
// binding = 'win32-x64-43'
// file = really long aws redirect link to the file to download
function downloadBinding (binding, file) {
    if (fileAlreadyDownloaded(binding)) {
        return;
    }

    var destination = path.join('.', 'node_modules', 'node-sass', 'vendor', binding, 'binding.node');

    file = url.parse(file);

    var options = {
        host: file.host,
        path: file.path,
        encoding: null,
        headers: {
            'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
        }
    };

    var output = fs.createWriteStream(destination);

    https.get(options, function (response) {
        response.pipe(output);
        output.on('finish', function () {
            output.close();
            console.log('Downloaded ' + binding);
        });
    }).on('error', function (err) {
        fs.unlinkSync(destination);
        console.error('Download binding Error:', err.message);
    });
}

// Hit the API supplied URL which contains a redirect page.
// Parse the redirect page to get the link to a live file to download
// Run downloadBinding to get the live file
// binding = 'win32-x64-43'
function getRedirect (binding) {
    if (fileAlreadyDownloaded(binding)) {
        return;
    }

    // 'https://github.com/sass/node-sass/releases/download/v4.8.2/win32-x64-43_binding.node'
    var fileURL = validAssets[binding + '_binding.node'];
    var file = url.parse(fileURL);

    var options = {
        host: file.host,
        path: file.path,
        encoding: null,
        headers: {
            'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
        }
    };

    https.get(options, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body = body + chunk;
        });

        response.on('end', function () {
            body = String(body);
            body = body.replace('<html><body>You are being <a href="', '');
            body = body.replace('">redirected</a>.</body></html>', '');
            body = body.split('&amp;').join('&');
            downloadBinding(binding, body);
        });
    }).on('error', function (err) {
        console.error('Error during redirect:', err.message);
    });
}

// Detect OS and then run getRedirect for the correct files to download
function detectOSForBindingDownload () {
    var os = process.platform;
    var arch = process.arch;

    if (os === 'win32') {
        getRedirect('win32-ia32-43');
        getRedirect('win32-x64-43');
    } else if (os === 'darwin') {
        if (arch === 'x64') {
            getRedirect('darwin-x64-43');
        } else {
            console.error('Your OS arch (' + arch + ') is not supported by Scout-App.');
        }
    } else if (os === 'linux') {
        if (arch === 'x64') {
            getRedirect('linux-x64-43');
        } else {
            getRedirect('linux-ia32-43');
        }
    } else {
        console.error('Your OS (' + os + ') is not supported by Scout-App');
    }
}

// Download list of latest releases for node-sass bindings
// Updated the validAssets object to have pairs of bindgingName: urlToRedirect
// Run the detectOSForBindingdownload when done
function getListOfLatestBindings () {

    var options = {
        host: 'api.github.com',
        path: '/repos/sass/node-sass/releases',
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
        }
    };

    var request = https.request(options, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body = body + chunk;
        });

        response.on('end', function () {
            var validReleases = [];
            var releases = JSON.parse(body);
            releases.forEach(function (release) {
                var assetsWithBindings = 0;
                if (release.assets && release.assets.length > 0) {
                    release.assets.forEach(function (asset) {
                        for (var binding in validAssets) {
                            if (binding === asset.name) {
                                assetsWithBindings++;
                            }
                        }
                    });
                    if (assetsWithBindings === bindingsTotal) {
                        validReleases.push(release);
                        return;
                    }
                }
            });

            var latest = validReleases[0];

            for (var binding in validAssets) {
                latest.assets.forEach(function (asset) {
                    if (asset.name === binding) {        
                        validAssets[binding] = asset.browser_download_url;
                    }
                });
            }

            detectOSForBindingDownload();
        });
    });

    request.on('error', function (err) {
        console.error('node-sass bindings api error: ' + err);
    });

    request.end();
}


getListOfLatestBindings();
deleteOldBindings();
