
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

    $("#inputFolderBrowse").change(function(){
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
    $("#outputFolderBrowse").change(function(){
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

    //Clicking the "Status of all Projects" sidebar buttons
    $("#viewStatus").click(function (evt) {
        evt.preventDefault();
        $("#project-settings").addClass('hide');
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
            $("#sidebar ." + id + " .btn").prop("disabled", true).css('-webkit-filter', 'grayscale()');
        }
    }

    function unlockSubmit (id) {
        id = id || $("#projectID").val();
        if (id) {
            //If a required element wasn't filled out in the form
            if ( $("#project-settings form").is(":invalid") ) {
                //Disable/Lock the submit button
                $("#sidebar ." + id + " .btn").prop("disabled", true).css('-webkit-filter', 'grayscale()');
            //If all required elements in the form have been fulfilled
            } else {
                //Enable/Unlock the submit button
                $("#sidebar ." + id + " .btn").prop("disabled", false).css('-webkit-filter', 'none');
            }
        }
    }

    $("#environment input").change( function (evt) {
        ugui.helpers.buildUGUIArgObject();
        if (ugui.args.development.htmlticked) {
            $($("#outputStyle option")[3]).hide();
            $($("#outputStyle option")[4]).hide();

            var isLabelSelected = $($("#outputStyle option")[0]).prop("selected");
            var isNestedSelected = $($("#outputStyle option")[1]).prop("selected");
            //If the first or second items in the dropdown are picked, that's cool, set everything else to the 3rd option
            if (isLabelSelected == false && isNestedSelected == false) {
                //Select "Expanded"
                $($("#outputStyle option")[2]).prop("selected", true);
            }
        } else {
            $($("#outputStyle option")[3]).show();
            $($("#outputStyle option")[4]).show();
        }
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
        $("#project-settings").addClass('hide');
        $("#printConsole .alert, #printConsole .panel").addClass('hide');
        removeModal();
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

})();
