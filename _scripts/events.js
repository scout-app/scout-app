
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

    function lockSubmit () {
        $("#runScout").prop("disabled", true);
    }

    function unlockSubmit () {
        //If a required element wasn't filled out in the form
        if ( $("#project-settings form").is(":invalid") ) {
            //Disable/Lock the submit button
            $("#runScout").prop("disabled", true);
        //If all required elements in the form have been fulfilled
        } else {
            //Enable/Unlock the submit button
            $("#runScout").prop("disabled", false);
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
    $("#delete-project").click(function (evt) {
        evt.preventDefault();
        $("#delete-modal").fadeIn();
    });
    $("#delete-modal #confirm-delete").click(function (evt) {
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
        $("#delete-modal").slideUp();
    });
    $("#delete-modal #cancel-delete, #delete-modal .glyphicon-remove").click(function (evt) {
        evt.preventDefault();
        $("#delete-modal").slideUp();
    });

    //On page load have this run once
    unlockSubmit();

    scout.helpers.unlockSubmit = unlockSubmit;

    $('.nodeSassVersion').html('(Node-Sass v' + scout.versions.nodeSass +  ' / LibSass v' + scout.versions.libSass + ')');

})();
