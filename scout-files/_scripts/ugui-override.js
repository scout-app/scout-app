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
                    // simplex.min.css
                    var cssFileName = files[index];
                    // simplex
                    var swatchName = files[index].split('.min.css')[0];
                    // For files without '.min' but with '.css'
                    swatchName = swatchName.split('.css')[0];
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
