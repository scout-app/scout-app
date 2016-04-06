
/*
  This file contains chunks from ugui.js copy/pasted in and modifed.
  Most of these will then be placed back on the window.ugui object,
  to replace the original. This means updating to newer versions of
  ugui.js in the future will be easier.
*/

(function(){


    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    //### D06. Check for updates
    //
    //>This is an advanced feature of UGUI useful to those
    // maintaining their projects on GitHub and posting releases
    // on their Repo's release page. This will check for the version
    // number of the latest release and compare it to the version
    // number in the `package.json`, then offer a link to the release
    // page if there is a newer release.
    //
    //>You must supply a "Repository URL" in your `package.json` file
    // and it must match the following pattern:
    //
    //`git://github.com/USERNAME/REPO.git`
    //
    //>And you must also publish releases on GitHub

    //When the user clicks the button in the help menu, contact Github and check for updates
    function checkForUpdates() {
        //git://github.com/USERNAME/REPO.git
        var repoURL = ugui.app.packageJSON.repository[0].url;
        //[ "git:", "", "github.com", "USERNAME", "REPO.git" ]
        var repoURLSplit = repoURL.split("/");
        var helpMessage = 'Visit UGUI.io/api to learn how to use the "Check for updates" feature.';

        //If the first or third items in the array match the pattern of a github repo
        if (repoURLSplit[0].toLowerCase() == "git:" || repoURLSplit[2].toLowerCase() == "github.com") {
            //Grab the Username from the Repo URL
            var username = repoURLSplit[3];
            //Get the Repo name from the Repo URL
            var repoName = repoURLSplit[4].split(".git")[0];
            //Build the URL for the API
            var updateURL = "https://api.github.com/repos/" + username + "/" + repoName + "/tags";
        } else {
            console.info('Unable to check for updates because your Repository ' +
                'URL does not match expected pattern.');
            console.info(helpMessage);
            return;
        }

        //Hit the GitHub API to get the data for latest releases
        $.ajax({
            url: updateURL,
            error: function(){
                //Display a message in the About Modal informing the user they have the latest version
                $("#updateResults").html(
                    '<p class="text-center">' +
                      '<strong data-lang="SERVER_DOWN">' + scout.localize("SERVER_DOWN") + '</strong>' +
                    '</p>'
                );
                console.info('Unable to check for updates because GitHub cannot be reached ' +
                    'or your Repository URL does not match expected pattern.');
                console.info(helpMessage);
                return;
            },
            success: function(data){
                //0.2.5
                var remoteVersion = data[0].name.split("v")[1].split('_')[0];
                var localVersion = ugui.app.version.split('-')[0];
                //[ "0", "2", "5" ]
                var rvs = remoteVersionSplit = remoteVersion.split(".");
                var lvs = localVersionSplit = localVersion.split(".");
                //Check if the Major, Minor, or Patch have been updated on the remote
                if (
                     (rvs[0] > lvs[0]) ||
                     (rvs[0] == lvs[0] && rvs[1] > lvs[1]) ||
                     (rvs[0] == lvs[0] && rvs[1] == lvs[1] && rvs[2] > lvs[2])
                   ) {
                    //Display in the About Modal a link to the release notes for the newest version
                    $("#updateResults").html(
                        '<p>' +
                          '<strong data-lang="UPDATE_FOUND">' + scout.localize("UPDATE_FOUND") + '</strong> ' +
                          '<a href="' + data[0].html_url + '" class="external-link" data-lang="VIEW_LATEST_RELEASE">' +
                            scout.localize("VIEW_LATEST_RELEASE") +
                          '</a>.' +
                        '</p>'
                    );
                    //Make sure the link opens in the user's default browser
                    ugui.helpers.openDefaultBrowser();
                //If there is not a new version of the app available
                } else {
                    //Display a message in the About Modal informing the user they have the latest version
                    $("#updateResults").html(
                        '<p class="text-center">' +
                          '<strong>' + scout.localize('LATEST_VERSION') + '</strong>' +
                        '</p>'
                    );
                }
            }
        });
    }

    //When the user clicks the "Check for updates" button in the about modal run the above function
    $("#scoutUpdateChecker").click(checkForUpdates);







    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    //### F05. Swap Bootswatches
    //
    //>This function is only ran when in dev mode. It grabs a list
    // of all files in the `ven.bootswatch` folder and puts them in
    // a dropdown box in UGUI Developer Toolbar so developers can
    // try out different stylesheets.

    //
    function themeSwapper() {
        var fs = require('fs');
        //Grab all the files in the `ven.bootswatch` folder and put them in an array
        var allSwatches = fs.readdir("_style/ven.bootswatch", function(err, files) {
            //If that works
            if (!err) {
                //Check each file and put it in the dropdown box
                for (index = 0; index < files.length; index++) {
                    var cssFileName = files[index];                     //simplex.min.css
                    var swatchName = files[index].split(".min.css")[0]; //simplex
                    $("#themeChoices").append(
                        '<option value="_style/ven.bootswatch/' + cssFileName + '">' +
                          swatchName +
                        '</option>'
                    );
                }
            } else {
                console.warn("Could not return list of style swatches.");
            }
        });

        //When you change what is selected in the dropdown box, swap out the current swatch for the new one.
        $("#swatchSwapper").change( function() {
            $("head link[data-swatch]").attr( "href", $("#swatchSwapper").val() );
            //Nav logo wasn't vertically centering after changing a stylesheet because the function was being ran after
            //the stylesheet was swapped instead of after the page rendered the styles. Since Webkit does not have a way of
            //indicating when a repaint finishes, unfortunately a delay had to be used. 71 was chosen because 14 FPS is the
            //slowest you can go in animation before something looks choppy.
            window.setTimeout(ugui.helpers.centerNavLogo, 140);
            window.setTimeout(ugui.helpers.sliderHandleColor, 140);
        });
    }

    themeSwapper();


})();
