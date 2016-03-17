
/*
  The handles creating new projects, saving them, and loading them.
*/

var path = require('path');
var sizeOf = require('image-size');

//This will change all UI elements for Project Settings back to an empty/default state
function resetProjectSettingsUI () {
    $("#projectIcon").attr('src', '_img/logo_128.png');
    $("#projectName").html('');
    $("#projectFolder").html('');
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
}

//'project-' + order + '-' + projectName

function autoGuessProject () {

    var projectPath = $("#projectFolder").val();
projectPath = 'C:/Users/Slim/Documents/GitHub/scout-app';
    var projectName = path.basename(projectPath);
    var autoFolders = [ "graphics", "images", "image", "imgs", "img", "_graphics", "_images", "_image", "_imgs", "_img" ];
    var autoInput = [ "scss", "sass", "_scss", "_sass" ];
    var autoOutput = [ "css", "styles", "style", "_css", "_styles", "_style" ];
    var imageFolder = "";
    var inputFolder = "";
    var outputFolder = "";

    ugui.helpers.readAFolder(projectPath, function (contents, contentsList) {
        for (var i = 0; i < contentsList.length; i++) {
            for (var j = 0; j < autoFolders.length; j++) {
                if (contentsList[i] == autoFolders[j]) {
                    imageFolder = autoFolders[j];
                }
            }
            for (var k = 0; k < autoInput; k++) {
                if (contentsList[i] == autoInput[j]) {
                    inputFolder = autoInput[j];
                }
            }
            for (var l = 0; l < autoOutput.length; l++) {
                if (contentsList[i] == autoOutput[l]) {
                    outputFolder = autoOutput[l];
                }
            }
        }
        var projectIcon = "";

        if (imageFolder.length > 0) {
            var imagePath = projectPath + '/' + imageFolder + '/';
            ugui.helpers.readAFolder(imagePath, function (contents, contentsList) {
                for (var i = 0; i < contentsList.length; i++) {
                    var file = imagePath + contentsList[i];
                    file = file.toLowerCase();
                    console.log(file);
                    if (
                        file.endsWith('.bmp')  ||
                        file.endsWith('.gif')  ||
                        file.endsWith('.jpeg') ||
                        file.endsWith('.jpg')  ||
                        file.endsWith('.png')  ||
                        file.endsWith('.webp') ||
                        file.endsWith('.svg')
                       )     {

                        var dimensions = sizeOf(file);
                        console.log(dimensions.width, dimensions.height);
                    }
                }
            });
        } else {
            //If no image can be found, use the Scout icon
            projectIcon = "_img/logo_128.png";
        }

        var newProject = {
            "projectFolder": projectPath,
            "projectName": projectName,
            "projectIcon": projectIcon,
            "inputFolder": "C:/Users/GLR/Documents/GitHub/UGUI/_sass",
            "outputFolder": "C:/Users/GLR/Documents/GitHub/UGUI/_style",
            "environment": "production",
            "outputStyle": "nested"
        };
        window.newProject = newProject;
    });
}

$("#addProject").click(function (event) {
    event.preventDefault();
    $("#addProjectBrowse").click();
});

$("#addProjectBrowse").change(function () {
    var folder = $("#addProjectBrowse").val();
    resetProjectSettingsUI();
});
