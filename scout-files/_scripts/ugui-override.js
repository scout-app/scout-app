/* eslint-disable no-console */

/*
  This file contains chunks from ugui.js copy/pasted in and modifed.
  Hopefully this will make updating to newer versions of ugui.js
  easier in the future.
*/

(function (window, $, scout, ugui) {

    var nw = require('nw.gui');
    var fs = require('fs-extra');

    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // ### D06. Check for updates
    //
    // >This is an advanced feature of UGUI useful to those
    // maintaining their projects on GitHub and posting releases
    // on their Repo's release page. This will check for the version
    // number of the latest release and compare it to the version
    // number in the `package.json`, then offer a link to the release
    // page if there is a newer release.
    //
    // >You must supply a "Repository URL" in your `package.json` file
    // and it must match the following pattern:
    //
    // `git://github.com/USERNAME/REPO.git`
    //
    // >And you must also publish releases on GitHub

    // When the user clicks the button in the help menu, contact Github and check for updates
    function checkForUpdates () {
        // git://github.com/USERNAME/REPO.git
        var repoURL = ugui.app.packageJSON.repository[0].url;
        // [ 'git:', '', 'github.com', 'USERNAME', 'REPO.git' ]
        var repoURLSplit = repoURL.split('/');
        var helpMessage = 'Visit UGUI.io/api to learn how to use the "Check for updates" feature.';

        // If the first or third items in the array match the pattern of a github repo
        if (repoURLSplit[0].toLowerCase() == 'git:' || repoURLSplit[2].toLowerCase() == 'github.com') {
            // Grab the Username from the Repo URL
            var username = repoURLSplit[3];
            // Get the Repo name from the Repo URL
            var repoName = repoURLSplit[4].split('.git')[0];
            // Build the URL for the API
            var updateURL = 'https://api.github.com/repos/' + username + '/' + repoName + '/tags';
        } else {
            console.info('Unable to check for updates because your Repository ' +
                'URL does not match expected pattern.');
            console.info(helpMessage);
            return;
        }

        // Hit the GitHub API to get the data for latest releases
        $.ajax({
            url: updateURL,
            error: function () {
                // Display a message in the About Modal informing the user they have the latest version
                $('#updateResults').html(
                    '<p class="text-center">' +
                      '<strong data-lang="SERVER_DOWN">' + scout.localize('SERVER_DOWN') + '</strong>' +
                    '</p>'
                );
                console.info('Unable to check for updates because GitHub cannot be reached ' +
                    'or your Repository URL does not match expected pattern.');
                console.info(helpMessage);
                return;
            },
            success: function (data) {
                // 0.2.5
                var remoteVersion = data[0].name.split('v')[1].split('_')[0];
                var localVersion = ugui.app.version.split('-')[0];
                // [ '0', '2', '5' ]
                var remoteVersionSplit = remoteVersion.split('.');
                var rvs = remoteVersionSplit;
                var localVersionSplit = localVersion.split('.');
                var lvs = localVersionSplit;
                // Check if the Major, Minor, or Patch have been updated on the remote
                if (
                     (rvs[0] > lvs[0]) ||
                     (rvs[0] == lvs[0] && rvs[1] > lvs[1]) ||
                     (rvs[0] == lvs[0] && rvs[1] == lvs[1] && rvs[2] > lvs[2])
                   ) {
                    // Display in the About Modal a link to the release notes for the newest version
                    $('#updateResults').html(
                        '<p>' +
                          '<strong data-lang="UPDATE_FOUND">' + scout.localize('UPDATE_FOUND') + '</strong> ' +
                          '<a href="' + data[0].html_url + '" class="external-link" data-lang="VIEW_LATEST_RELEASE">' +
                            scout.localize('VIEW_LATEST_RELEASE') +
                          '</a>.' +
                        '</p>'
                    );
                    // Make sure the link opens in the user's default browser
                    ugui.helpers.openDefaultBrowser();
                // If there is not a new version of the app available
                } else {
                    // Display a message in the About Modal informing the user they have the latest version
                    $('#updateResults').html(
                        '<p class="text-center">' +
                          '<strong data-lang="LATEST_VERSION">' + scout.localize('LATEST_VERSION') + '</strong>' +
                        '</p>'
                    );
                }
            }
        });
    }

    // When the user clicks the "Check for updates" button in the about modal run the above function
    $('#scoutUpdateChecker').click(checkForUpdates);







    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // ### F06. Save chosen Bootswatch
    //
    // >In File > Preferences > Theme, when the user picks a new theme
    // read the contents of the index.html, find the line that sets
    // which CSS theme to use and update it to the new chosen theme.
    // Then replace the contents of index.html with the new data so
    // on every load it uses the correct theme.

    //
    function saveNewSwatch (newSwatch) {
        // Validate that the required argument is passed and is the correct type
        if (!newSwatch || typeof(newSwatch) !== 'string') {
            console.info('You must pass in a new swatch as a string');
            return;
        }

        // Set the filename to whatever the page is NW.js opens on launch, like index.htm
        var filename = ugui.app.startPage;

        // Read the contents of index.htm like a normal file and put them in the 'data' variable
        fs.readFile(filename, 'utf8', function (err, data) {
            // If it can't read it for some reason, throw an error
            if (err) {
                console.warn(err);
                return;
            }

            // Set up for the regex
            var re_start = '(<link rel="stylesheet" href="_themes\\/)';
            var re_file = '((?:[a-z][a-z\\.\\d_]+)\\.(?:[a-z\\d]{3}))(?![\\w\\.])';
            var re_end = '(" data-swatch="swapper">)';

            // Would match: `<link rel="stylesheet" href="_themes/cerulean.min.css" data-swatch="swapper">`
            var createRegex = RegExp(re_start + re_file + re_end, ['i']);
            var findSwatchLine = createRegex.exec(data);
            // If we could find the line in the file
            if (findSwatchLine != null) {
                // Though not currently using this line, it may come in handy someday
                // `var currentSwatch = findSwatchLine[52];`

                var lineToFind = '<link rel="stylesheet" href="' + newSwatch + '" data-swatch="swapper">';

                // Take the contents of index.htm, find the correct line, and replace that line with the updated swatch
                data = data.replace(createRegex, lineToFind);
            }

            // With the contents of index.htm update, save over the file
            fs.writeFile(filename, data, function (err) {
                if (err) {
                    console.warn(err);
                    return;
                }
            });
        });
    }







    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // ### F05. Swap Bootswatches
    //
    // >This grabs a list of all files in the `_themes` folder
    // and puts them in a dropdown box under File > Preferences, so
    // users can try out different stylesheets.

    //
    function themeSwapper () {
        // Grab all the files in the `_themes` folder and put them in an array
        fs.readdir('scout-files/_themes', function (err, files) {
            // If that works
            if (!err) {
                // Check each file and put it in the dropdown box
                for (var index = 0; index < files.length; index++) {
                    var cssFileName = files[index];                     // simplex.min.css
                    var swatchName = files[index].split('.min.css')[0]; // simplex
                    swatchName = swatchName.split('.css')[0];           // For files without '.min' but with '.css'
                    $('#themeChoices').append(
                        '<option value="_themes/' + cssFileName + '">' +
                          swatchName +
                        '</option>'
                    );
                }
            } else {
                console.warn('Could not return list of style swatches.');
            }
            // Set the correct item in the dropdown to be selected.
            var pageSetting = $('head link[data-swatch]').attr('href');

            for (var i = 0; i < $('#themeChoices option').length; i++) {
                if ($($('#themeChoices option')[i]).val() == pageSetting) {
                    $($('#themeChoices option')[i]).prop('selected', true);
                }
            }
        });

        // When you change what is selected in the dropdown box, swap out the current swatch for the new one.
        $('#themeChoices').change(function () {
            // The currently selected swatch
            var newSwatch = $('#themeChoices').val();
            $('head link[data-swatch]').attr('href', newSwatch);

            // Nav logo wasn't vertically centering after changing a stylesheet because the function was being ran after
            // the stylesheet was swapped instead of after the page rendered the styles. Since Webkit does not have a way of
            // indicating when a repaint finishes, unfortunately a delay had to be used. 71 was chosen because 14 FPS is the
            // slowest you can go in animation before something looks choppy.
            window.setTimeout(ugui.helpers.centerNavLogo, 140);
            window.setTimeout(ugui.helpers.sliderHandleColor, 140);
            window.setTimeout(scout.helpers.projectRenameHeight, 140);

            // Update index.htm to use the selected swatch as the new default
            saveNewSwatch(newSwatch);
        });
    }

    themeSwapper();


    // The Scout-App.exe arguments that are temporarily stored in the UGUI App object.
    // Since you need to check at one point if args are passed in, but clear them out later.
    // We store them here temporarily because nw.App.argv cannot be cleared out.
    ugui.app.argv = nw.App.argv;

})(window, window.$, window.scout, window.ugui);
