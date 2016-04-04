
/*
  FTUX: First Time User Experience
  This is to help with the empty state of the app on first use
  or when you just have 0 projects.
*/

(function(){

    function loadFTUX () {
        var width = $("#sidebar").css("width");
        //Hide everything!
        $("#sidebar").css("left", "-" + width);
        $("#project-settings, #printConsoleTitle, #printConsole .alert, #printConsole .panel").fadeOut();
        //Show FTUX
        $("#ftux").fadeIn("slow");
    }

    function unloadFTUX () {
        //Hide FTUX
        $("#ftux").fadeOut();
        //Show everything!
        $("#sidebar").css("left", "0px");
        $("#project-settings, #printConsoleTitle, #printConsole .alert, #printConsole .panel").fadeIn();
    }

    function autoGuessProjectsFolder () {
        var projectsFolder = "";
        var autoProjects = ["github", "projects", "repositories", "repos", "websites"];

        //Set default paths to check based on OS standards
        var homePath = "";
        var myDocsPath = "";
        if (process.platform == "linux") {
            homePath = process.env.HOME;
            myDocsPath = homePath + "/Documents";
        } else if (process.platform == "win32") {
            homePath = process.env.USERPROFILE;
            myDocsPath = homePath + "\\Documents";
        } else if (process.platform == "darwin") {
            homePath = "/Users/" + process.env.USER;
            myDocsPath = homePath + "/Documents";
        }

        //Check the user profile for common project folders
        var contents = ugui.helpers.readAFolder(homePath);
        for (var i = 0; i < contents.length; i++) {
            for (var j = 0; j < autoProjects.length; j++) {
                if (contents[i].name.toLowerCase() == autoProjects[j]) {
                    projectsFolder = homePath.split('\\').join('/') + '/' + contents[i].name;
                    scout.ftux.projectsFolder = projectsFolder;
                    return;
                }
            }
        }
        //then look in My Docs if it isn't in the user profile
        if (!projectsFolder) {
            var myDocsContents = ugui.helpers.readAFolder(myDocsPath);
            for (var i = 0; i < myDocsContents.length; i++) {
                for (var j = 0; j < autoProjects.length; j++) {
                    if (myDocsContents[i].name.toLowerCase() == autoProjects[j]) {
                        projectsFolder = myDocsPath.split('\\').join('/') + '/' + myDocsContents[i].name;
                        scout.ftux.projectsFolder = projectsFolder;
                        return;
                    }
                }
            }
        }
        //If on Window and no project folder was found in Docs or User, check drive roots (slow)
        if (!projectsFolder && process.platform == "win32") {
            //Each drive letter adds like half a second to load time, so I limited them to the common ones
            var driveLetters = ["C", "D", "E", "F", "Z", "Y", "X", "G", "H", "M", "N",];
            var shortProjects = ["GitHub", "Projects"];
            var fs = require('fs');
            var stats = "";
            for (var i = 0; i < driveLetters.length; i++) {
                for (var j = 0; j < shortProjects.length; j++) {
                    var driveAndFolder = driveLetters[i] + ":/" + shortProjects[j];
                    try {
                        stats = fs.lstatSync(driveAndFolder);
                        if (stats.isDirectory()) {
                            projectsFolder = driveAndFolder;
                            scout.ftux.projectsFolder = projectsFolder;
                            return;
                        }
                    }
                    catch (err) {
                        continue;
                    }
                }
            }
        }

        scout.ftux.projectsFolder = projectsFolder;
    }

    function autoGrabProjects (path) {
        $("#ftux .panel-body").empty();
        var projectsFolder = path || scout.ftux.projectsFolder;
        var projects = "";
        if (projectsFolder) {
            projects = ugui.helpers.readAFolder(projectsFolder);
        }
        if (!projectsFolder || projects.length < 1) {
            $("#ftux .panel-body").html("No projects found.");
            return;
        }
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].isFolder) {
                var name = projects[i].name;
                var item =
                  '<label class="col-xs-6">' +
                    '<input type="checkbox" value="' + projectsFolder + '/' + name + '" checked="checked"> ' +
                    name +
                  '</label>';
                $("#ftux .panel-body").append(item);
            }
        }
    }

    function updatePanelContent (path) {
        var folder = "";
        if (scout.ftux.projectsFolder) {
            if (process.platform == "win32") {
                folder = path || scout.ftux.projectsFolder.split('/').join('\\');
            } else {
                folder = path || scout.ftux.projectsFolder;
            }
            $("#ftuxProjectsFolder").text(folder);
        }
    }

    function ftuxEvents () {
        $("#ftux .panel-body label").click(function () {
            ftuxUnlock();
        });
        $("#ftuxSelectAll").click(function () {
            var inputs = $("#ftux .panel-body input");
            for (var i = 0; i < inputs.length; i++) {
                $(inputs[i]).prop('checked', true);
            }
            ftuxUnlock();
        });
        $("#ftuxDeselectAll").click(function () {
            var inputs = $("#ftux .panel-body input");
            for (var i = 0; i < inputs.length; i++) {
                $(inputs[i]).prop('checked', false);
            }
            ftuxUnlock();
        });
        $("#ftuxStartImport").click(function (evt) {
            if ($("#ftuxStartImport").hasClass('gray')) {
                evt.preventDefault();
                return;
            }
            var inputs = $("#ftux .panel-body input:checked");
            for (var i = 0; i < inputs.length; i++) {
                var path = $(inputs[i]).val();
                scout.helpers.autoGenerateProject(path);
            }
            scout.helpers.saveSettings;
            unloadFTUX();
        });
        $("#ftuxPickFolder").click(function (evt) {
            evt.preventDefault();
            $("#ftuxProjectBrowse").click();
            ftuxUnlock();
        });
        $("#ftuxProjectBrowse").change(function () {
            var path = $("#ftuxProjectBrowse").val();
            autoGrabProjects(path);
            updatePanelContent(path);
            ftuxUnlock();
            $("#ftux .panel-body label").click(function () {
                ftuxUnlock();
            });
        });
    }

    function ftuxUnlock () {
        var inputs = $("#ftux .panel-body input:checked");
        if (inputs.length < 1) {
            $("#ftuxStartImport").prop('disable', true).addClass('gray');
        } else {
            $("#ftuxStartImport").prop('disable', false).removeClass('gray');
        }
    }

    //The main FTUX function
    function ftux () {
        if (scout.projects.length < 1) {
            loadFTUX();
            autoGuessProjectsFolder();
            autoGrabProjects();
            updatePanelContent();
            ftuxEvents();
            ftuxUnlock();
        }
    }

    //run once
    ftux();
    scout.helpers.ftux = ftux;

})();
