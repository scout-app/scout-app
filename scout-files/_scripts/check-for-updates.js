/* eslint-disable no-console */

/*
  This will read the user's scout-settings.json file from
  their OS's application data folder. Each OS stores this in
  a different place. Then we update:
   * window.scout.projects
   * window.scout.globalSettings.cultureCode
*/

(function (scout, $, marked) {
    var url = require('url');
    var https = require('https');

    function newVersionFound (data) {
        $('#printConsole').prepend(
            '<h4 class="text-center">' +
              '<button class="btn btn-success text-center">' +
                '<big>' +
                  'Download latest Scout-App version.' + // TODO: Translate
                '</big>' +
              '</button>' +
            '</h4>' +
            '<div class="panel panel-info">' +
              '<div class="panel-heading">' +
                'New Scout-App Version' + // TODO: Translate
                '<span class="pull-right version">' + data.tag_name + '</span>' +
              '</div>' +
              '<div class="panel-body">' +
                marked(data.body) +
              '</div>' +
              '<div class="panel-footer">' +
                '<a href="http://scout-app.io" class="external-link">' +
                  'Download latest Scout-App version.' + // TODO: Translate
                '</a>' +
              '</div>' +
            '</div>'
        );
        console.log(data);
    }

    function checkForUpdates () {
        // Alternate URL: 'https://api.github.com/repos/scout-app/scout-app/tags/latest'
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

})(window.scout, window.$, window.marked);
