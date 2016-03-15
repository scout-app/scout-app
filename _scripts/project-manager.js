
/*
  The handles creating new projects, saving them, and loading them.
*/

var path = require('path');
var sizeOf = require('image-size');

function createNewProject () {

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
    });

    var projectIcon = "";

    if (imageFolder.length > 0) {
        var imagePath = projectPath + '/' + imageFolder + '/';
        ugui.helpers.readAFolder(imagePath, function (contents, contentsList) {
            for (var i = 0; i < contentsList.length; i++) {
                console.log(contentsList[i]);
                console.log(sizeOf(imagePath + contentsList[i]));
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
}
