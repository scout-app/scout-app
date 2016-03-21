
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

function autoGuessProjectFolders (autoImages, autoInput, autoOutput) {
    var projectFolder = window.newProject.projectFolder;
    if (projectFolder.length < 1) {
        return;
    }
    var projectPath = projectFolder + '/';
    var projectName = path.basename(projectFolder);
    var imageFolder = "";
    var inputFolder = "";
    var outputFolder = "";

    ugui.helpers.readAFolder(projectFolder, function (contents, contentsList) {
        for (var i = 0; i < contentsList.length; i++) {
            var currentItem = contentsList[i];
            if (contents[currentItem].isFolder) {
                var currentFolder = currentItem;
                //Autoguess the image folder (img)
                for (var j = 0; j < autoImages.length; j++) {
                    if (currentFolder == autoImages[j]) {
                        imageFolder = projectPath + autoImages[j];
                    }
                }
                //Autoguess the input folder (sass)
                for (var k = 0; k < autoInput.length; k++) {
                    if (currentFolder == autoInput[k]) {
                        inputFolder = projectPath + autoInput[k];
                    }
                }
                //Autoguess the output folder (css)
                for (var l = 0; l < autoOutput.length; l++) {
                    if (currentFolder == autoOutput[l]) {
                        outputFolder = projectPath + autoOutput[l];
                    }
                }
            }
        }
    });

    if (!window.newProject) {
        window.newProject = {}
    }

    window.newProject.projectName = projectName;
    window.newProject.imageFolder = imageFolder;
    window.newProject.inputFolder = inputFolder;
    window.newProject.outputFolder = outputFolder;
}

function autoGuessSrcDist (srcDist, autoFolder, newProjectProperty) {

    if (srcDist = "src") {
        srcDist = [ "source", "src" ];
    } else if (srcDist = "dist") {
        srcDist = [ "built", "distribution", "production", "prod", "build", "dist" ];
    }

    var projectPath = window.newProject.projectFolder + '/';

    ugui.helpers.readAFolder(window.newProject.projectFolder, function (contents, contentsList) {
        //loop through C:/myproj/*
        for (var i = 0; i < contentsList.length; i++) {
            var currentItem = contentsList[i];
            //only proceed if it's a folder
            if (contents[currentItem].isFolder) {
                //loop through ["src","source"] or ["dist", "build"]
                for (var j = 0; j < srcDist.length; j++) {
                    //if thing in project folder is what we are looking for: C:/myproj/src
                    if (currrentItem == srcDist[j]) {
                        //subfolder = src
                        var subfolder = srcDist[j];
                        //read folder C:/myproj/src/ or C:/myproj/dist
                        ugui.helpers.readAFolder(projectPath + subfolder, function (srcDistContents, srcDistContentsList) {
                            //loop throuhg C:/myproj/src/*
                            for (var k = 0; k < srcDistContentsList.length; k++) {
                                var srcDistCurrentItem = srcDistContentsList[k];
                                //only proceed if a folder
                                if (srcDistContents[srcDistCurrentItem].isFolder) {
                                    for (var l = 0; l < autoFolder.length; l++) {
                                        if (srcDistCurrentItem == autoFolder[l]) {
                                            var path = projectPath + subfolder + '/' + autoFolder[l];
                                            window.newProject[newProjectProperty] = path;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    });
}

function autoGuessProjectIcon () {
    var imgFolder = window.newProject.imageFolder;

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
                    contents[currentItem].width = dimensions.width;
                    contents[currentItem].height = dimensions.height;
                    contents[currentItem].ratio = Math.round((dimensions.width/dimensions.height)*100)/100;
                } else {
                    //Remove the non-images from the contents object and contentsList Array
                    delete contents[currentItem];
                    contentsList.splice(i, 1);
                    //Since we removed what was at i, something new will be there, we need to recheck it
                    i--;
                }
            }
        }
        console.log(contents);
        debugger;
        window.newProject.projectIcon = projectIcon;
    });
}

$("#addProject, #file-newproject").click(function (event) {
    event.preventDefault();
    $("#addProjectBrowse").click();
});

$("#addProjectBrowse").change(function () {
    resetProjectSettingsUI();

    var autoImages = [ "graphics", "images", "image", "imgs", "img", "_graphics", "_images", "_image", "_imgs", "_img" ];
    var autoInput = [ "scss", "sass", "_scss", "_sass" ];
    var autoOutput = [ "css", "styles", "style", "_css", "_styles", "_style" ];

    //Get the path for the project folder the user selected
    var folder = $("#addProjectBrowse").val();
    //Set it to the New Project object, converting windows slashes to unix
    window.newProject.projectFolder = folder.split('\\').join('/');
    //Look for commonly named folders so the user doesn't need to manually do anything
    autoGuessProjectFolders(autoImages, autoInput, autoOutput);

    //If the autoguesser failed to find the folders in the root of the project, check in src and dist folders
    if (window.newProject.imageFolder.length < 1) {
        autoGuessSrcDist('src', autoImages, 'imageFolder');
    }
    if (window.newProject.inputFolder.length < 1) {
        autoGuessSrcDist('src', autoInput, 'inputFolder');
    }
    if (window.newProject.outputFolder.length < 1) {
        autoGuessSrcDist('dist', autoOutput, 'outputFolder');
    }

    //If we found an image folder, look for a good icon
    if (window.newProject.imageFolder.length > 0) {
        autoGuessProjectIcon();
    }

    //Reset the folder browse box
    $("#addProjectBrowse").val("");
});
