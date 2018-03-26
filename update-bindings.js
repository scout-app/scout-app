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

var updateBindings = {
    validAssets: {
        'darwin-x64-43_binding.node': { url: '', size: 0 },
        'linux-ia32-43_binding.node': { url: '', size: 0 },
        'linux-x64-43_binding.node':  { url: '', size: 0 },
        'win32-ia32-43_binding.node': { url: '', size: 0 },
        'win32-x64-43_binding.node':  { url: '', size: 0 }
    },
    bindingsTotal: function () {
        var total = Object.keys(this.validAssets).length;
        return total;
    },
    // check if the file is already downloaded
    // create directory to store file if it does not exist
    // if file exists, verify it is the correct size, delete it if it is not
    // return bool so other functions can bail if file already downloaded
    fileAlreadyDownloaded: function (binding) {
        var directory = path.join('.', 'node_modules', 'node-sass', 'vendor', binding);
        fs.ensureDirSync(directory);
        var destination = path.join(directory, 'binding.node');
        var intendedSize = this.validAssets[binding + '_binding.node'].size;
        if (fs.existsSync(destination)) {
            var localSize = fs.statSync(destination).size;
            console.log('Binding: ' + binding);
            console.log('localSize: ' + localSize);
            console.log('intendedSize: ' + intendedSize);
            if (localSize === intendedSize) {
                return true;
            }

            try {
                fs.removeSync(destination);
            } catch (err) {
                console.log('Failed deleting: ' + destination);
            }

            return false;
        }
        return false;
    },
    // success === boolean
    // binding === string
    bindingAlert: function (success, binding) {
        var equal = '===============================';
        var intro = '\n\n\n' + equal + '\n';
        var outro = '\n' + equal + '\n\n\n';

        var output = intro;
        if (success) {
            output += 'Binding Update Verified';
        } else {
            output += 'Binding Update Failed';
        }
        output += ': ' + binding + outro;

        console.log(output);
    },
    // Check that the files all downloaded and are the correct size
    verifyDownloads: function () {
        // console.log(this.validAssets);

        var os = process.platform;
        var arch = process.arch;

        if (os === 'win32') {
            if (this.fileAlreadyDownloaded('win32-ia32-43')) {
                this.bindingAlert(true, 'win32-ia32-43');
            } else {
                this.bindingAlert(false, 'win32-ia32-43');
                this.getRedirect('win32-ia32-43', myCallBack);
            }

            if (this.fileAlreadyDownloaded('win32-x64-43')) {
                this.bindingAlert(true, 'win32-x64-43');
            } else {
                this.bindingAlert(false, 'win32-x64-43');
                this.getRedirect('win32-x64-43', myCallBack);
            }
        } else if (os === 'darwin') {
            if (this.fileAlreadyDownloaded('darwin-x64-43')) {
                this.bindingAlert(true, 'darwin-x64-43');
            } else {
                this.bindingAlert(false, 'darwin-x64-43');
                this.getRedirect('darwin-x64-43', myCallBack);
            }
        } else if (os === 'linux') {
            if (arch === 'x64') {
                if (this.fileAlreadyDownloaded('linux-x64-43')) {
                    this.bindingAlert(true, 'linux-x64-43');
                } else {
                    this.bindingAlert(false, 'linux-x64-43');
                    this.getRedirect('linux-x64-43', myCallBack);
                }
            } else if (arch === 'ia32') {
                if (this.fileAlreadyDownloaded('linux-ia32-43')) {
                    this.bindingAlert(true, 'linux-ia32-43');
                } else {
                    this.bindingAlert(false, 'linux-ia32-43');
                    this.getRedirect('linux-ia32-43', myCallBack);
                }
            }
        }
    },
    // Loop over all items in the node-sass/vendor folder
    // loop over the keys of validAssets
    // If the item in the folder is not a valid asset, delete it
    deleteOldBindings: function () {
        var directory = path.join('.', 'node_modules', 'node-sass', 'vendor');
        var vendors = fs.readdirSync(directory);
        vendors.forEach(function (vendor) {
            var isValid = false;

            for (var binding in this.validAssets) {
                if (vendor + '_binding.node' === binding) {
                    isValid = true;
                }
            }

            var pathToDelete = path.join(directory, vendor);
            if (!isValid && fs.existsSync(pathToDelete)) {
                try {
                    fs.removeSync(pathToDelete);
                } catch (err) {
                    console.log('Failed deleting: ' + pathToDelete);
                }
            }
        });
    },
    // Actually downloadsthe binding to the correct folder
    // binding = 'win32-x64-43'
    // file = really long aws redirect link to the file to download
    downloadBinding: function (binding, file, cb) {
        if (this.fileAlreadyDownloaded(binding)) {
            if (typeof(cb) === 'function') {
                cb('downloadBinding fileAlreadyDownloaded');
            } else {
                this.deleteOldBindings();
                this.verifyDownloads();
            }
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
                if (typeof(cb) === 'function') {
                    cb('downloadBinding finish');
                } else {
                    this.deleteOldBindings();
                    this.verifyDownloads();
                }
                console.log('Downloaded ' + binding);
            }.bind(this));
        }.bind(this)).on('error', function (err) {
            fs.unlinkSync(destination);
            if (typeof(cb) === 'function') {
                cb('downloadBinding error');
            } else {
                this.deleteOldBindings();
                this.verifyDownloads();
            }
            console.error('Download binding Error:', err.message);
        }.bind(this));
    },
    // Hit the API supplied URL which contains a redirect page.
    // Parse the redirect page to get the link to a live file to download
    // Run downloadBinding to get the live file
    // binding = 'win32-x64-43'
    getRedirect: function (binding, cb) {
        if (this.fileAlreadyDownloaded(binding)) {
            if (typeof(cb) === 'function') {
                cb('getRedirect fileAlreadyDownloaded');
            } else {
                this.deleteOldBindings();
                this.verifyDownloads();
            }
            return;
        }

        // 'https://github.com/sass/node-sass/releases/download/v4.8.2/win32-x64-43_binding.node'
        var fileURL = this.validAssets[binding + '_binding.node'].url;
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
            }.bind(this));

            response.on('end', function () {
                body = String(body);
                body = body.replace('<html><body>You are being <a href="', '');
                body = body.replace('">redirected</a>.</body></html>', '');
                body = body.split('&amp;').join('&');
                this.downloadBinding(binding, body, cb);
            }.bind(this));
        }.bind(this)).on('error', function (err) {
            if (typeof(cb) === 'function') {
                cb('getRedirect error');
            } else {
                this.deleteOldBindings();
                this.verifyDownloads();
            }
            console.error('Error during redirect:', err.message);
        }.bind(this));
    },
    // Detect OS and then run getRedirect for the correct files to download
    detectOSForBindingDownload: function (cb) {
        var os = process.platform;
        var arch = process.arch;

        if (os === 'win32') {
            this.getRedirect('win32-ia32-43', cb);
            this.getRedirect('win32-x64-43', cb);
        } else if (os === 'darwin') {
            if (arch === 'x64') {
                this.getRedirect('darwin-x64-43', cb);
            } else {
                console.error('Your OS arch (' + arch + ') is not supported by Scout-App.');
            }
        } else if (os === 'linux') {
            if (arch === 'x64') {
                this.getRedirect('linux-x64-43', cb);
            } else {
                this.getRedirect('linux-ia32-43', cb);
            }
        } else {
            console.error('Your OS (' + os + ') is not supported by Scout-App');
        }
    },
    // Download list of latest releases for node-sass bindings
    // Updated the validAssets object to have pairs of bindgingName: urlToRedirect
    // Run the detectOSForBindingdownload when done
    getListOfLatestBindings: function (cb) {
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
            }.bind(this));

            response.on('end', function () {
                var validReleases = [];
                var releases = JSON.parse(body);
                releases.forEach(function (release) {
                    var assetsWithBindings = 0;
                    if (release.assets && release.assets.length > 0) {
                        release.assets.forEach(function (asset) {
                            for (var binding in this.validAssets) {
                                if (binding === asset.name) {
                                    assetsWithBindings++;
                                }
                            }
                        }.bind(this));
                        if (assetsWithBindings === this.bindingsTotal()) {
                            validReleases.push(release);
                            return;
                        }
                    }
                }.bind(this));

                var latest = validReleases[0];

                for (var binding in this.validAssets) {
                    latest.assets.forEach(function (asset) {
                        if (asset.name === binding) {
                            this.validAssets[binding].url = asset.browser_download_url;
                            this.validAssets[binding].size = asset.size;
                        }
                    }.bind(this));
                }
                this.detectOSForBindingDownload(cb);
            }.bind(this));
        }.bind(this));

        request.on('error', function (err) {
            if (typeof(cb) === 'function') {
                cb('getListOfLatestBindings error');
            } else {
                this.deleteOldBindings();
                this.verifyDownloads();
            }
            console.error('node-sass bindings api error: ' + err);
        }.bind(this));

        request.end();
    }
};

// eslint-disable-next-line no-unused-vars
function myCallBack (location) {
    console.log(location);
    updateBindings.deleteOldBindings();
    updateBindings.verifyDownloads();
}

updateBindings.getListOfLatestBindings(myCallBack);
