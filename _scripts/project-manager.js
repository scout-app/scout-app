
/*
The handles creating new projects, saving them, and loading them.
*/

(function(){

    //This will change all UI elements for Project Settings back to an empty/default state
    function resetProjectSettingsUI () {
        $("#projectIcon").attr('src', '_img/logo_128.png');
        $("#projectName").html('');
        $("#projectFolder").val('');
        $("#inputFolder").val('');
        $("#inputFolderBrowse").attr('nwworkingdir','...');
        $("#inputFolderBrowse").val('');
        $("#outputFolder").val('');
        $("#outputFolderBrowse").attr('nwworkingdir','...');
        $("#outputFolderBrowse").val('');
        $("#outputWarning").addClass('hide');
        $('#environment input[data-argname="development"]').click();
        $($("#outputStyle option")[0]).prop("selected", true);
        $("#printConsole .alert, #printConsole .panel").addClass('hide');

        var newProject = {
            "projectID":     "",
            "projectFolder": "",
            "projectName":   "",
            "imageFolder":   "",
            "projectIcon":   "",
            "inputFolder":   "",
            "outputFolder":  "",
            "environment":   "production",
            "outputStyle":   "compressed",
            "indicator":     "play"
        };
        scout.newProject = newProject;
    }

    /**
     * Pass in the project ID starting with 'sa' to remove it
     * from the scout.projects array.
     *
     * @param  {string}   projectID
     *
     * scout.helpers.removeProject('sa0000000000000');
     */
    function removeProject (projectID) {
        if (!projectID || typeof(projectID) !== "string") {
            console.log("Can't remove project, pass in a valid project ID to remove");
            return;
        }

        for (var i = 0; i < scout.projects.length; i++) {
            var currentItem = scout.projects[i].projectID;
            if (projectID == currentItem) {
                var projectToRemove = scout.projects[i];
                scout.projects.remove(projectToRemove);
            }
        }
        scout.helpers.updateSidebar();
        scout.helpers.saveSettings();
    }

    /**
     * Pass in a object containing all the settings for a project:
     *
     * var project = {
     *        "projectID":     "sa0000000000000",
     *        "projectName":   "my-project",
     *        "projectFolder": "~/GitHub/my-project",
     *        "inputFolder":   "~/GitHub/my-project/_sass",
     *        "outputFolder":  "~/GitHub/my-project/_style",
     *        "projectIcon":   "~/GitHub/my-project/_img/meta/logo.png",
     *        "environment":   "production",
     *        "outputStyle":   "compressed"
     *    }
     *
     * @param {object}   project
     */
    function addProject (project) {
        if (!project || typeof(project) !== "object") {
            console.log("Can't add project, you need to pass in a valid project.")
            return;
        }
        if (!project.projectID ||
            !project.projectName ||
            !project.projectFolder
        ) {
            console.log("Can't add project, you are missing stuff.");
            console.log(project);
            return;
        }

        //Add to the end of the projects list
        scout.projects.push(project);

        scout.helpers.updateSidebar();
        saveSettings();
    }

    function saveSettings () {
        var appData = require('nw.gui').App.dataPath;
        appData.split('\\').join('/');
        var settingsJSON = appData + "/scout-settings.json"

        ugui.helpers.writeToFile(settingsJSON, JSON.stringify(scout));
    }

    /**
     * This Update the UI for the Project Settings.
     * It accepts the an object for the `base` argument
     * that looks like this:
     *
     *    {
     *        "projectID":     "sa0000000000000",
     *        "projectName":   "my-project",
     *        "projectFolder": "~/GitHub/my-project",
     *        "inputFolder":   "~/GitHub/my-project/_sass",
     *        "outputFolder":  "~/GitHub/my-project/_style",
     *        "projectIcon":   "~/GitHub/my-project/_img/meta/logo.png",
     *        "environment":   "production",
     *        "outputStyle":   "compressed"
     *    }
     *
     */
    function updateProjectSettingsView (base) {
        var base = base || scout.newProject;
        $("#projectIcon"  ).attr('src', base.projectIcon);
        $("#projectName"  ).html(       base.projectName);
        $("#projectID"    ).val(        base.projectID);
        $("#projectFolder").val(        base.projectFolder);
        $("#inputFolder"  ).val(        base.inputFolder);
        $("#outputFolder" ).val(        base.outputFolder);
        $(".project-name" ).text(       base.projectName);

        var workingDir = base.projectFolder;
        if (ugui.platform == "win32") {
            workingDir = workingDir.split('/').join('\\');
        }

        $("#inputFolderBrowse" ).attr('nwworkingdir', workingDir);
        $("#outputFolderBrowse").attr('nwworkingdir', workingDir);

        //Output Style dropdown must be updated before Environment
        var outputStyleOption = $("#outputStyle option");
        for (var i = 1; i < outputStyleOption.length; i++) {
            var current = $(outputStyleOption[i]).val();
            if (base.outputStyle == current) {
                $(outputStyleOption[i]).prop("selected", true);
            }
        }

        //Environment
        if (base.environment == "production") {
            $('#environment input[data-argName="production"]').click();
        } else if (base.environment == "development") {
            $('#environment input[data-argName="development"]').click();
        }

        scout.helpers.unlockSubmit();
        $("#printConsole .alert, #printConsole .panel").addClass('hide');
        $("#project-settings").removeClass('hide');
        $("#printConsole ." + base.projectID).removeClass('hide');
        $("#printConsoleTitle").addClass('hide');
        $("#sidebar .active").removeClass('active');
        $("#sidebar ." + base.projectID).addClass('active');
    }

    scout.helpers.resetProjectUI = resetProjectSettingsUI;

    //updateProjectSettingsView(scout.projects[0]);
    scout.helpers.updateProjectSettingsView = updateProjectSettingsView;

    //scout.helpers.removeProject('sa1459092789554');
    scout.helpers.removeProject = removeProject;

    //scout.helpers.addProject( {projectID:'',projectName:'',projectFolder:'',inputFolder:'',outputFolder:'',projectIcon:'',environment:'',outputStyle:''} );
    scout.helpers.addProject = addProject;

    //Save scout object to file in app data folder
    scout.helpers.saveSettings = saveSettings;

})();
