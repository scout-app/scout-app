/* eslint-disable no-console */

/*
  This will read the user's scout-settings.json file from
  their OS's application data folder. Each OS stores this in
  a different place. Then we update:
   * window.scout.projects
   * window.scout.globalSettings.cultureCode
*/

(function (scout) {

    var fs = require('fs-extra');
    var path = require('path');
    var nw = require('nw.gui');
    var appData = nw.App.dataPath;
    var settingsFile = path.join(appData, 'scout-settings.json');

    var settingsJSON = '';
    // Attempt to read the settings file
    try {
        settingsJSON = fs.readFileSync(settingsFile, { encoding: 'utf-8' });
    } catch (err) {
        // If the file does exist grab its error code
        if (err.code === 'ENOENT') {
            console.info('No settings file found, no biggie.');
        } else {
            throw err;
        }
    }

    // Verify we got data back from reading the file
    if (settingsJSON.length > 1) {
        // Convert it from a string to JSON
        var settingsObj = JSON.parse(settingsJSON);

        // update the scout object
        scout.projects = settingsObj.projects;
        scout.globalSettings = settingsObj.globalSettings || {};
        // Check if lang is stored in the 2.5.x+ location, then check if it's in the 2.0.x location, then give it 'en'
        if (settingsObj.globalSettings) {
            scout.globalSettings.cultureCode = settingsObj.globalSettings.cultureCode || settingsObj.cultureCode || 'en';
        } else {
            scout.globalSettings.cultureCode = settingsObj.cultureCode || 'en';
        }

        for (var i = 0; i < scout.projects.length; i++) {
            var project = scout.projects[i];
            project.watcher = '';
            if (project.indicator == 'stop') {
                project.indicator = 'play';
            }
        }

        // Update dictionary
        scout.helpers.setLanguage(scout.globalSettings.cultureCode);
    }
})(window.scout);
