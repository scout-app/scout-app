
/*
  Reads the scout-settings.json file from the appdata folder.
  Updates window.scout.projects and window.scout.cultureCode.
*/

(function(){
    var gui = require("nw.gui");
    var fs = require("fs");

    var settingsFile = "";

    //If you're on windows then folders in file paths are separated with `\`, otherwise OS's use `/`
    if ( process.platform == "win32" ) {
        //Find the path to the settings file and store it
        settingsFile = (gui.App.dataPath + "\\scout-settings.json");
    } else {
        //Find the path to the settings file and store it
        settingsFile = (gui.App.dataPath + "/scout-settings.json");
    }

    var settingsJSON = "";
    //Attempt to read the settings file
    try {
        settingsJSON = fs.readFileSync(settingsFile, {encoding: "utf-8"});
    } catch (err) {
        //If the file does exist grab it's error code
        if (err.code === 'ENOENT') {
            console.info('No settings file found, no biggie.');
        } else {
            throw err;
        }
    }

    //Verify we got data back from reading the file
    if (settingsJSON.length > 1) {
        //Convert it from a string to JSON
        var settingsObj = JSON.parse(settingsJSON);

        //update the scout object
        scout.projects = settingsObj.projects;
        scout.cultureCode = settingsObj.cultureCode || "en";

        for (var i = 0; i < scout.projects.length; i++) {
            var project = scout.projects[i];
            project.watcher = "";
            if (project.indicator == "stop") {
                project.indicator = "play";
            }
        }

        //Update dictionary
        scout.helpers.setLanguage(scout.cultureCode);
    }

})()
