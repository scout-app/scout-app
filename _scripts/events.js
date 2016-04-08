
/*
  Event bindings and DOM Manipulation.
*/

(function(){

    //Set the default starting folder for browse boxes
    var projectFolder = $("#projectFolder").val();
    $("#projectIconBrowse").attr("nwworkingdir", projectFolder);
    $("#inputFolderBrowse").attr("nwworkingdir", projectFolder);
    $("#outputFolderBrowse").attr("nwworkingdir", projectFolder);

    $("#projectIconHover").click( function () { $("#projectIconBrowse" ).click(); });
    $("#inputFolderIcon" ).click( function () { $("#inputFolderBrowse" ).click(); });
    $("#outputFolderIcon").click( function () { $("#outputFolderBrowse").click(); });

    $("#projectIconBrowse").change(function () {
        var newImg = $("#projectIconBrowse").val();
        $("#projectIcon").attr('src', newImg);
        var id = $("#projectID").val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].projectIcon = newImg;
                scout.helpers.saveSettings();
            }
        }
    });
    $("#inputFolderBrowse").change(function () {
        var newDir = $("#inputFolderBrowse").val();
        newDir = newDir.split('\\').join('\/');
        $("#inputFolder").val(newDir);
        forbidSameFolder();
        var id = $("#projectID").val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].inputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });
    $("#outputFolderBrowse").change(function () {
        var newDir = $("#outputFolderBrowse").val();
        newDir = newDir.split('\\').join('\/');
        $("#outputFolder").val(newDir);
        forbidSameFolder();
        var id = $("#projectID").val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].inputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });
    $("#outputStyle").change(function () {
        var id = $("#projectID").val();
        var outputStyle = $("#outputStyle").val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].outputStyle = outputStyle;
            }
        }
    });

    //Clicking the "Status of all Projects" sidebar buttons
    $("#viewStatus").click(function (evt) {
        evt.preventDefault();
        $("#project-settings").addClass('hide');
        $("#printConsoleTitle").removeClass('hide');
        $("#sidebar .active").removeClass('active');
        $("#printConsole .alert, #printConsole .panel").removeClass('hide');
    });

    function forbidSameFolder () {
        var inputDir = $("#inputFolder").val();
        var outputDir = $("#outputFolder").val();
        var id = $("#projectID").val();

        //Update projects object
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].inputFolder = inputDir;
                scout.projects[i].outputFolder = outputDir;
            }
        }

        //Check validity of input and output
        if ( inputDir === "" || outputDir === "" ) {
            $("#outputWarning").addClass("hide");
            lockSubmit(id);
        } else if ( (inputDir === outputDir) || (outputDir.startsWith(inputDir + '/')) ) {
            $("#outputWarning").removeClass('hide');
            lockSubmit(id);
        } else {
            $("#outputWarning").addClass("hide");
            unlockSubmit(id);
        }
    }

    $("#inputFolder, #outputFolder").keyup(forbidSameFolder).mouseup(forbidSameFolder).change(forbidSameFolder);

    function lockSubmit (id) {
        id = id || $("#projectID").val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].indicator = "gray-play";
                scout.helpers.updateSidebar();
                scout.helpers.saveSettings();
                $("#sidebar .active").removeClass("active");
                $("#sidebar ." + id).addClass("active");
                return;
            }
        }
    }

    function unlockSubmit (id) {
        id = id || $("#projectID").val();
        for (var i = 0; i < scout.projects.length; i++) {
            var project  = scout.projects[i];
            var inputDir = project.inputFolder;
            var outputDir = project.outputFolder;
            if (
                (inputDir === "") ||
                (outputDir === "") ||
                (inputDir === outputDir) ||
                (outputDir.startsWith(inputDir + '/')) ||
                (outputDir.startsWith(inputDir + '\\'))
            ) {
                project.indicator = "gray-play";
                scout.helpers.stopWatching( project.projectID );
            } else if (project.indicator == "stop") {
                project.indicator = "stop";
            } else {
                project.indicator = "play";
            }
        }
        scout.helpers.updateSidebar();
        $("#sidebar .active").removeClass("active");
        if (id) {
            $("#sidebar ." + id).addClass("active");
        }
    }

    $("#environment input").change( function (evt) {
        ugui.helpers.buildUGUIArgObject();
        var manuallyUpdateOutputStyle = false;
        if (ugui.args.development.htmlticked) {
            $($("#outputStyle option")[3]).hide();
            $($("#outputStyle option")[4]).hide();

            var isLabelSelected = $($("#outputStyle option")[0]).prop("selected");
            var isNestedSelected = $($("#outputStyle option")[1]).prop("selected");
            //If the first or second items in the dropdown are picked, that's cool, set everything else to the 3rd option
            if (isLabelSelected == false && isNestedSelected == false) {
                //Select "Expanded"
                $($("#outputStyle option")[2]).prop("selected", true);
                manuallyUpdateOutputStyle = true;
            }
        } else {
            $($("#outputStyle option")[3]).show();
            $($("#outputStyle option")[4]).show();
        }

        var environment = $(evt.currentTarget).val();
        var id = $("#projectID").val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id === scout.projects[i].projectID) {
                scout.projects[i].environment = environment;
                if (manuallyUpdateOutputStyle) {
                    scout.projects[i].outputStyle = $("#outputStyle").val();
                }
            }
        }

        scout.helpers.saveSettings();
    });

    /**
     * DELETING A PROJECT
     */
    //Remove modal, enable scrollbar
    function removeModal () {
        $(".modal").slideUp("slow", function() {
            $("body").removeClass('no-overflow');
            //If the navigation is expanded, then close it after exiting the modal
            if ( !$(".navbar-toggle").hasClass("collapsed") ) {
                $(".navbar-toggle").trigger("click");
            }
        });
    }
    //Click "Delete Project"
    $("#delete-project").click(function (evt) {
        evt.preventDefault();
        var projectName = $("#projectName").text();
        $(".project-name").text(projectName);
        $("#confirm-delete").removeClass('gray');
        $("#delete-modal").fadeIn("slow");

        //Remove page scrollbar when modal displays
        $("body").addClass("no-overflow");
    });
    //Confirm delete in the modal
    $("#confirm-delete").click(function (evt) {
        evt.preventDefault();

        if (!$("#confirm-delete").hasClass('gray')) {
            $("#confirm-delete").addClass('gray');

            var id = $("#projectID").val();

            //Remove project from the object
            scout.helpers.removeProject(id);
            //remove all related alerts/messages from the DOM
            $("#printConsole ." + id + " .glyphicon-remove").click();

            //Wipe out UI
            scout.helpers.resetProjectUI();
            $("#printConsole .alert, #printConsole .panel").addClass('hide');
            removeModal();

            if (scout.projects.length > 0) {
                $($("#projects-list > div")[0]).click();
            }
        }

    });
    //When clicking on background, cancel button, or X, remove modal
    $(".modal, #cancel-delete, .modal .glyphicon-remove").click( removeModal );
    //Allow you to click in the modal without triggering the `removeModal` function called when you click its parent element
    $(".modal .modal-content").click( function( evt ) {
        evt.stopPropagation();
    });

    //On page load have this run once
    unlockSubmit();

    scout.helpers.unlockSubmit = unlockSubmit;

    /**
     * OSX Keybindings.
     * On Windows and Ubuntu Scout-App inherits the OS's global clipboard shortcuts.
     * OSX needs you to spoon feed it how to copy and paste.
     */
    function osxKeyBindings() {
        //Keyboard shortcuts
        document.onkeydown = function(pressed) {
            //Check CMD+V and CMD+v keys and paste
            if (
                pressed.metaKey && pressed.keyCode === 86 ||
                pressed.metaKey && pressed.keyCode === 118 ) {
                    pressed.preventDefault();
                    document.execCommand("paste");
                    return false;
            //Check CMD+C and CMD+c keys and copy
            } else if (
                pressed.metaKey && pressed.keyCode === 67 ||
                pressed.metaKey && pressed.keyCode === 99 ) {
                    pressed.preventDefault();
                    document.execCommand("copy");
                    return false;
            //Check CMD+X  and CMD+x and cut
            } else if (
                pressed.metaKey && pressed.keyCode === 88 ||
                pressed.metaKey && pressed.keyCode === 120 ) {
                    pressed.preventDefault();
                    document.execCommand("cut");
                    return false;
            }
        };
    }

    //run once on page load
    if (process.platform == "darwin") {
        osxKeyBindings();
    }


})();
