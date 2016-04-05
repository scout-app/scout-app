
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
        console.info(º+'Unable to check for updates because your Repository ' +
            'URL does not match expected pattern.', consoleNormal);
        console.info(º+helpMessage, consoleNormal);
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
            console.info(º+'Unable to check for updates because GitHub cannot be reached ' +
                'or your Repository URL does not match expected pattern.', consoleError);
            console.info(º+helpMessage, consoleNormal);
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
                      '<strong>You have the latest version of ' + ugui.app.name + '.</strong>' +
                    '</p>'
                );
            }
        }
    });
}

//When the user clicks the "Check for updates" button in the about modal run the above function
$("#scoutUpdateChecker").click(checkForUpdates);

})();
