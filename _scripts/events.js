
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
    });
    $("#outputFolderBrowse").change(function(){
        var newDir = $("#outputFolderBrowse").val();
        newDir = newDir.split('\\').join('\/');
        $("#outputFolder").val(newDir);
        forbidSameFolder();
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

    $("#environment input").change( function (event) {
        ugui.helpers.buildUGUIArgObject();
        if (ugui.args.development.htmlticked) {
            $($("#outputStyle option")[3]).hide()
            $($("#outputStyle option")[4]).hide()

            var isLabelSelected = $($("#outputStyle option")[0]).prop("selected");
            var isNestedSelected = $($("#outputStyle option")[1]).prop("selected");
            //If the first or second items in the dropdown are picked, that's cool, set everything else to the 3rd option
            if (isLabelSelected == false && isNestedSelected == false) {
                //Select "Expanded"
                $($("#outputStyle option")[2]).prop("selected", true);
            }
        } else {
            $($("#outputStyle option")[3]).show()
            $($("#outputStyle option")[4]).show()
        }
    });

    //On page load have this run once
    unlockSubmit();

    $('.nodeSassVersion').html('(Node-Sass v' + scout.versions.nodeSass +  ' / LibSass v' + scout.versions.libSass + ')');

})();
