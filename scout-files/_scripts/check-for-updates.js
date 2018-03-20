/* eslint-disable no-console */

/*
  If the user has left the ""
*/

(function (scout, $, ugui, marked) {
    var url = require('url');
    var https = require('https');

    function newVersionFound (data) {
        var UPDATE_FOUND_TITLE = 'New Scout-App Version'; // TODO: Translate
        var UPDATE_FOUND_DOWNLOAD = 'Download the latest version of Scout-App.'; // TODO: Translate
        // scout.localize('');

        $('#printConsole').prepend(
            '<div id="updateFound">' +
              '<div class="panel panel-info">' +
                '<div class="panel-heading">' +
                  UPDATE_FOUND_TITLE +
                  '<span class="pull-right version">' + data.tag_name + '</span>' +
                '</div>' +
                '<div class="panel-body">' +
                  '<h4 class="text-center">' +
                    '<a href="http://scout-app.io" class="btn btn-success text-center">' +
                      '<big>' +
                        UPDATE_FOUND_DOWNLOAD +
                      '</big>' +
                    '</a>' +
                  '</h4>' +
                  marked(data.body) +
                '</div>' +
                '<div class="panel-footer">' +
                  '<a href="http://scout-app.io">' +
                    UPDATE_FOUND_DOWNLOAD +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</div>'
        );
        $('#updateFound a').addClass('external-link');
        ugui.helpers.openDefaultBrowser();
        console.log(data);
    }

    function checkForUpdates () {
        var file = url.parse('https://api.github.com/repos/scout-app/scout-app/releases/latest');

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
                body = JSON.parse(body);

                // var semver = require('semver');
                // var localVersion = nw.App.manifest.version;
                // var latestVersion = body.tag_name.replace('v', '');

                // if latest is greater than local
                // if (semver.gt(latestVersion, localVersion)) {
                newVersionFound(body);
                // }
            });
        }).on('error', function (err) {
            console.error('Error during update check:', err.message);
        });
    }

    // TODO: add to globals
    // TODO: add checkbox in about
    // TODO: Create new alert box function
    var automaticUpdates = true;
    if (automaticUpdates) {
        checkForUpdates();
    }

    scout.helpers.checkForUpdates = checkForUpdates;

})(window.scout, window.$, window.ugui, window.marked);
