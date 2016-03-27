
/*
The handles creating new projects, saving them, and loading them.
*/

(function(){

    /**
     * Pass in the project ID starting with 'sa' to remove it
     * from the scout.projects array.
     *
     * @param  {string}   projectID
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
        updateSidebar();
        updateSettingsFile();
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
            !project.projectFolder ||
            !project.inputFolder ||
            !project.outputFolder ||
            !project.projectIcon ||
            !project.environment ||
            !project.outputStyle ||
            typeof(project.projectID) !== "string" ||
            typeof(project.projectName) !== "string" ||
            typeof(project.projectFolder) !== "string" ||
            typeof(project.inputFolder) !== "string" ||
            typeof(project.outputFolder) !== "string" ||
            typeof(project.projectIcon) !== "string" ||
            typeof(project.environment) !== "string" ||
            typeof(project.outputStyle) !== "string"
        ) {
            console.log("Can't add project, you are missing stuff.");
            return;
        }

        //Add to the end of the projects list
        scout.projects.push(project);

        updateSidebar();
        updateSettingsFile();
    }

    function updateSidebar () {
        console.log("updateSidebar");
    }

    function updateSettingsFile () {
        console.log("updateSettingsFile");
    }

    //scout.helpers.removeProject('sa1459092789554');
    scout.helpers.removeProject = removeProject;

    //scout.helpers.addProject( {projectID:'',projectName:'',projectFolder:'',inputFolder:'',outputFolder:'',projectIcon:'',environment:'',outputStyle:''} );
    scout.helpers.addProject = addProject;

})();
