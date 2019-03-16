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
    'darwin-x64-43_binding.node': { url: '', size: 0 },
    'linux-ia32-43_binding.node': { url: '', size: 0 },
    'linux-x64-43_binding.node':  { url: '', size: 0 },
    'win32-ia32-43_binding.node': { url: '', size: 0 },
    'win32-x64-43_binding.node':  { url: '', size: 0 }
};
var bindingsTotal = Object.keys(validAssets).length;

// check if the file is already downloaded
// create directory to store file if it does not exist
// if file exists, verify it is the correct size, delete it if it is not
// return bool so other functions can bail if file already downloaded
function fileAlreadyDownloaded (binding) {
    var directory = path.join('.', 'node_modules', 'node-sass', 'vendor', binding);
    fs.ensureDirSync(directory);
    var destination = path.join(directory, 'binding.node');
    var intendedSize = validAssets[binding + '_binding.node'].size;
    if (fs.existsSync(destination)) {
        var localSize = fs.statSync(destination).size;
        // console.log(localSize, intendedSize);
        if (localSize === intendedSize) {
            return true;
        }
        fs.removeSync(destination);
        return false;
    }
    return false;
}

// Check that the files all downloaded and are the correct size
function verifyDownloads () {
    // console.log(validAssets);

    var os = process.platform;
    var arch = process.arch;
    var equal = '===============================';
    var intro = '\n\n\n' + equal + '\n';
    var outro = '\n' + equal + '\n\n\n';
    var success = intro + 'Binding Update Verified' + outro;
    var failure = intro + 'Binding Update Failed' + outro;

    if (os === 'win32') {
        if (fileAlreadyDownloaded('win32-ia32-43')) {
            console.log(success);
        } else {
            console.error(failure);
            getRedirect('win32-ia32-43', myCallBack);
        }

        if (fileAlreadyDownloaded('win32-x64-43')) {
            console.log(success);
        } else {
            console.log(failure);
            getRedirect('win32-x64-43', myCallBack);
        }
    } else if (os === 'darwin') {
        if (fileAlreadyDownloaded('darwin-x64-43')) {
            console.log(success);
        } else {
            console.error(failure);
            getRedirect('darwin-x64-43', myCallBack);
        }
    } else if (os === 'linux') {
        if (arch === 'x64') {
            if (fileAlreadyDownloaded('linux-x64-43')) {
                console.log(success);
            } else {
                console.error(failure);
                getRedirect('linux-x64-43', myCallBack);
            }
        } else if (arch === 'ia32') {
            if (fileAlreadyDownloaded('linux-ia32-43')) {
                console.log(success);
            } else {
                console.error(failure);
                getRedirect('linux-ia32-43', myCallBack);
            }
        }
    }
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
function downloadBinding (binding, file, cb) {
    if (fileAlreadyDownloaded(binding)) {
        cb('downloadBinding fileAlreadyDownloaded');
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
            cb('downloadBinding finish');
            console.log('Downloaded ' + binding);
        });
    }).on('error', function (err) {
        fs.unlinkSync(destination);
        cb('downloadBinding error');
        console.error('Download binding Error:', err.message);
    });
}

// Hit the API supplied URL which contains a redirect page.
// Parse the redirect page to get the link to a live file to download
// Run downloadBinding to get the live file
// binding = 'win32-x64-43'
function getRedirect (binding, cb) {
    if (fileAlreadyDownloaded(binding)) {
        cb('getRedirect fileAlreadyDownloaded');
        return;
    }

    // 'https://github.com/sass/node-sass/releases/download/v4.8.2/win32-x64-43_binding.node'
    var fileURL = validAssets[binding + '_binding.node'].url;
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
            downloadBinding(binding, body, cb);
        });
    }).on('error', function (err) {
        cb('getRedirect error');
        console.error('Error during redirect:', err.message);
    });
}

// Detect OS and then run getRedirect for the correct files to download
function detectOSForBindingDownload (cb) {
    var os = process.platform;
    var arch = process.arch;

    if (os === 'win32') {
        getRedirect('win32-ia32-43', cb);
        setTimeout(function () {
            getRedirect('win32-x64-43', cb);
        }, 4000);
    } else if (os === 'darwin') {
        if (arch === 'x64') {
            getRedirect('darwin-x64-43', cb);
        } else {
            console.error('Your OS arch (' + arch + ') is not supported by Scout-App.');
        }
    } else if (os === 'linux') {
        if (arch === 'x64') {
            getRedirect('linux-x64-43', cb);
        } else {
            getRedirect('linux-ia32-43', cb);
        }
    } else {
        console.error('Your OS (' + os + ') is not supported by Scout-App');
    }
}

// Download list of latest releases for node-sass bindings
// Updated the validAssets object to have pairs of bindgingName: urlToRedirect
// Run the detectOSForBindingdownload when done
function getListOfLatestBindings (cb) {
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
                        validAssets[binding].url = asset.browser_download_url;
                        validAssets[binding].size = asset.size;
                    }
                });
            }

            detectOSForBindingDownload(cb);
        });
    });

    request.on('error', function (err) {
        cb('getListOfLatestBindings error');
        console.error('node-sass bindings api error: ' + err);
    });

    request.end();
}

// eslint-disable-next-line no-unused-vars
function myCallBack (location) {
    // console.log(location);
    deleteOldBindings();
    verifyDownloads();
}

getListOfLatestBindings(myCallBack);
