
/*
  Event bindings and DOM Manipulation
*/

(function(){

    //Set the default starting folder for browse boxes
    var projectFolder = $("#projectFolder").val();
    $("#inputFolderBrowse").attr("nwworkingdir", projectFolder);
    $("#outputFolderBrowse").attr("nwworkingdir", projectFolder);

    $("#inputFolderIcon" ).click( function () { $("#inputFolderBrowse" ).click(); });
    $("#outputFolderIcon").click( function () { $("#outputFolderBrowse").click(); });

    $("#inputFolderBrowse").change(function () {
        var newDir = $("#inputFolderBrowse").val();
        newDir = newDir.split('\\').join('\/');
        $("#inputFolder").val(newDir);
        forbidSameFolder();
        var id = $("#projectID").val()
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
        var id = $("#projectID").val()
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].inputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });
    $("#outputStyle").change(function () {
        var id = $("#projectID").val()
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
        if ( inputDir === "" || outputDir === "" ) {
            return;
        } else if ( (inputDir === outputDir) || (outputDir.startsWith(inputDir + '/')) ) {
            $("#outputWarning").removeClass('hide');
            lockSubmit();
        } else {
            $("#outputWarning").addClass("hide");
            unlockSubmit();
        }
    }

    $("#inputFolder, #outputFolder").keyup(forbidSameFolder).mouseup(forbidSameFolder);

    function lockSubmit (id) {
        id = id || $("#projectID").val();
        if (id) {
            $("#sidebar ." + id + " .btn").prop("disabled", true).addClass("gray");
        }
    }

    function unlockSubmit () {
        for (var i = 0; i < scout.projects.length; i++) {
            var inputDir = scout.projects[i].inputFolder;
            var outputDir = scout.projects[i].outputFolder;
            if ( inputDir === "" || outputDir === "" ) {
                scout.projects[i].indicator = "gray-play";
            } else if ( (inputDir === outputDir) || (outputDir.startsWith(inputDir + '/')) ) {
                scout.projects[i].indicator = "gray-play";
            }
        }
        scout.helpers.updateSidebar();
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
        $("#delete-modal").fadeIn("slow");

        //Remove page scrollbar when modal displays
        $("body").addClass("no-overflow");
    });
    //Confirm delete in the modal
    $("#confirm-delete").click(function (evt) {
        evt.preventDefault();
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

    $('.nodeSassVersion').html('(Node-Sass v' + scout.versions.nodeSass +  ' / LibSass v' + scout.versions.libSass + ')');
    $('.chokidarVersion').html('v' + scout.versions.chokidar);

})();
