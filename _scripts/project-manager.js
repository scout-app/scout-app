
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

    var newProject = {
        "projectFolder": "",
        "projectName":   "",
        "imageFolder":   "",
        "projectIcon":   "_img/logo_128.png",
        "inputFolder":   "",
        "outputFolder":  "",
        "environment":   "production",
        "outputStyle":   "nested"
    };
    window.newProject = newProject;
}

//'project-' + order + '-' + projectName

function autoGuessProjectFolders (folder) {
    var projectPath = folder || $("#projectFolder").val();
    if (projectPath.length < 1) {
        return;
    }
    var projectName = path.basename(projectPath);
    var autoImages = [ "graphics", "images", "image", "imgs", "img", "_graphics", "_images", "_image", "_imgs", "_img" ];
    var autoInput = [ "scss", "sass", "_scss", "_sass" ];
    var autoOutput = [ "css", "styles", "style", "_css", "_styles", "_style" ];
    var imageFolder = "";
    var inputFolder = "";
    var outputFolder = "";

    ugui.helpers.readAFolder(projectPath, function (contents, contentsList) {
        for (var i = 0; i < contentsList.length; i++) {
            var currentItem = contentsList[i];
            if (contents[currentItem].isFolder) {
                var currentFolder = currentItem;
                for (var j = 0; j < autoImages.length; j++) {
                    if (currentFolder == autoImages[j]) {
                        imageFolder = autoImages[j];
                    }
                }
                for (var k = 0; k < autoInput; k++) {
                    if (currentFolder == autoInput[k]) {
                        inputFolder = autoInput[k];
                    }
                }
                for (var l = 0; l < autoOutput.length; l++) {
                    if (currentFolder == autoOutput[l]) {
                        outputFolder = autoOutput[l];
                    }
                }
                if (currentFolder = 'dist') {
                    var dist = projectPath + '/' + currentFolder;
                    ugui.helpers.readAFolder(dist, function (distContents, distContentsList) {
                        for (var m = 0; m < distContentsList.length; m++) {
                            var distItem = distContentsList[m];
                            if (distContents[distItem].isFolder) {
                                for (var n = 0; n < autoImages.length; n++) {
                                    if (currentFolder == autoImages[n]) {
                                        imageFolder = autoImages[n];
                                    }
                                }
                                for (var o = 0; o < autoInput; o++) {
                                    if (currentFolder == autoInput[o]) {
                                        inputFolder = autoInput[o];
                                    }
                                }
                                for (var p = 0; p < autoOutput.length; p++) {
                                    if (currentFolder == autoOutput[p]) {
                                        outputFolder = autoOutput[p];
                                    }
                                }
                            }
                        }
                    });
                }
                if (currentFolder = 'src') {
                    var src = projectPath + '/' + currentFolder;
                    ugui.helpers.readAFolder(src, function (srcContents, srcContentsList) {
                        console.log(srcContentsList);
                    });
                }
            }
        }
    }

    window.newProject.projectName = projectName;
    window.newProject.imageFolder = "";
    window.newProject.inputFolder = "";
    window.newProject.outputFolder = "";
}

function autoGuessDistSrc () {
    console.log("stub");
}

function autoGuessProjectIcon (imageFolder) {
    var imgFolder = imageFolder || window.newProject.imageFolder;
    if (imgFolder.length < 1) {
        return;
    }
    ugui.helpers.readAFolder(imgFolder, function (contents, contentsList) {
        var projectIcon = "_img/logo_128.png";
        //Set the size for each image
        for (var i = 0; i < contentsList.length; i++) {
            var currentItem = contentsList[i];
            if (contents[currentItem].isFolder == false) {
                var file = imgFolder + '/' + currentItem;
                var lowerFile = file.toLowerCase();
                if (
                    lowerFile.endsWith('.bmp')  ||
                    lowerFile.endsWith('.gif')  ||
                    lowerFile.endsWith('.jpeg') ||
                    lowerFile.endsWith('.jpg')  ||
                    lowerFile.endsWith('.png')  ||
                    lowerFile.endsWith('.webp') ||
                    lowerFile.endsWith('.svg')
                   ) {
                    var dimensions = sizeOf(file);
                    console.log(dimensions.width + "x" + dimensions.height);
                    contents[currentItem].width = dimensions.width;
                    contents[currentItem].height = dimensions.height;
                }
            }
        }
        window.newProject.projectIcon = projectIcon;
    });
}

$("#addProject").click(function (event) {
    event.preventDefault();
    $("#addProjectBrowse").click();
});

$("#addProjectBrowse").change(function () {
    var folder = $("#addProjectBrowse").val();
    resetProjectSettingsUI();
    autoGuessProjectFolders(folder);
    if (window.imageFolder.length < 1) {
        autoGuessDistSrc();
    }
    autoGuessProjectIcon()
});
