/* eslint-disable no-console */

/*
  If the user has left the ""
*/

(function (scout, $) {
    var url = require('url');
    var https = require('https');
    var nw = require('nw.gui');

    function newVersionFound (data) {
        $('#updateResults').html(
            '<p class="text-center">' +
              '<strong data-lang="UPDATE_FOUND">' + scout.localize('UPDATE_FOUND') + '</strong> ' +
              '<a href="http://scout-app.io" class="external-link" data-lang="DOWNLOAD_UPDATE">' +
                scout.localize('DOWNLOAD_UPDATE') +
              '</a>' +
            '</p>'
        );
        scout.helpers.updateAlert(data);
    }

    function youHaveTheLatestVersion () {
        $('#updateResults').html(
            '<p class="text-center">' +
              '<strong data-lang="LATEST_VERSION">' + scout.localize('LATEST_VERSION') + '</strong>' +
            '</p>'
        );
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

                var semver = require('semver');
                var localVersion = nw.App.manifest.version;
                var latestVersion = body.tag_name.replace('v', '');

                // if latest is greater than local
                if (semver.gt(latestVersion, localVersion)) {
                    newVersionFound(body);
                } else {
                    youHaveTheLatestVersion();
                }
            });
        }).on('error', function (err) {
            $('#updateResults').html(
                '<p class="text-center">' +
                  '<strong data-lang="SERVER_DOWN">' + scout.localize('SERVER_DOWN') + '</strong>' +
                '</p>'
            );
            console.error('Error during update check:', err.message);
        });
    }

    var automaticUpdates = scout.globalSettings.automaticUpdates;
    if (automaticUpdates) {
        checkForUpdates();
    }

    scout.helpers.checkForUpdates = checkForUpdates;

})(window.scout, window.$);
