
/*
The handles creating new projects, filling out the settings view, and guessing the
input/output folders and project icon.
*/

(function(){

var path = require('path');

//This will change all UI elements for Project Settings back to an empty/default state
function resetProjectSettingsUI () {
    $("#projectIcon").attr('src', '_img/logo_128.png');
    $("#projectName").html('');
    $("#projectFolder").val('');
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
        "projectID":     "",
        "projectFolder": "",
        "projectName":   "",
        "imageFolder":   "",
        "projectIcon":   "",
        "inputFolder":   "",
        "outputFolder":  "",
        "environment":   "production",
        "outputStyle":   "compressed"
    };
    scout.newProject = newProject;
}

function autoGuessProjectFolders (autoInput, autoOutput) {
    var projectFolder = scout.newProject.projectFolder;
    if (projectFolder.length < 1) {
        return;
    }
    var projectPath = projectFolder + '/';
    var projectName = path.basename(projectFolder);
    var inputFolder = "";
    var outputFolder = "";

    ugui.helpers.readAFolder(projectFolder, function (contents) {
        for (var i = 0; i < contents.length; i++) {
            var currentItem = contents[i];
            if (currentItem.isFolder) {
                var currentFolder = currentItem.name.toLowerCase();
                //Autoguess the input folder (sass)
                for (var j = 0; j < autoInput.length; j++) {
                    if (currentFolder == autoInput[j]) {
                        inputFolder = projectPath + autoInput[j];
                    }
                }
                //Autoguess the output folder (css)
                for (var k = 0; k < autoOutput.length; k++) {
                    if (currentFolder == autoOutput[k]) {
                        outputFolder = projectPath + autoOutput[k];
                    }
                }
            }
        }
    });

    if (outputFolder && !inputFolder) {
        ugui.helpers.readAFolder(outputFolder, function (contents) {
            for (var i = 0; i < contents.length; i++) {
                var currentItem = contents[i].name.toLowerCase();
                if (contents[i].isFolder) {
                    for (var j = 0; j < autoInput.length; j++) {
                        if (currentItem == autoInput[j]) {
                            inputFolder = outputFolder + '/' + autoInput[j];
                        }
                    }
                }
            }
        });
    }

    if (!scout.newProject) {
        scout.newProject = {}
    }

    scout.newProject.projectName = projectName;
    scout.newProject.inputFolder = inputFolder;
    scout.newProject.outputFolder = outputFolder;
}

function autoGuessSrcDist (srcDist, autoFolder, newProjectProperty) {

    if (srcDist == "src") {
        srcDist = [ "source", "src" ];
    } else if (srcDist == "dist") {
        srcDist = [ "built", "public", "distribution", "production", "prod", "build", "dist" ];
    } else {
        srcDist = [ "built", "public", "distribution", "production", "prod", "build", "source", "dist", "src" ]
    }

    var projectPath = scout.newProject.projectFolder;

    ugui.helpers.readAFolder(projectPath, function (contents) {
        //loop through C:/myproj/*
        for (var i = 0; i < contents.length; i++) {
            var currentItem = contents[i].name.toLowerCase();
            //only proceed if it's a folder
            if (contents[i].isFolder) {
                //loop through ["src","source"] or ["dist", "build"]
                for (var j = 0; j < srcDist.length; j++) {
                    //subfolder = src
                    var subfolder = srcDist[j];
                    //if thing in project folder is what we are looking for: C:/myproj/src
                    if (currentItem == subfolder) {
                        //read folder C:/myproj/src/ or C:/myproj/dist
                        ugui.helpers.readAFolder(projectPath + '/' + subfolder, function (SDContents) {
                            //loop throuhg C:/myproj/src/*
                            for (var k = 0; k < SDContents.length; k++) {
                                var SDCurrentItem = SDContents[k].name.toLowerCase();
                                //only proceed if a folder
                                if (SDContents[k].isFolder) {
                                    for (var l = 0; l < autoFolder.length; l++) {
                                        var subsubfolder = autoFolder[l];
                                        if (SDCurrentItem == subsubfolder) {
                                            var path = projectPath + '/' + subfolder + '/' + subsubfolder;
                                            scout.newProject[newProjectProperty] = path;
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

function autoGuessImageFolder (autoImages) {
    var projectFolder = scout.newProject.projectFolder;

    ugui.helpers.readAFolder(projectFolder, function (contents) {
        var src = false;
        var imgFolder = false;

        //Loop throught the contents of the project folder
        for (var i = 0; i < contents.length; i++) {
            var currentItem = contents[i].name.toLowerCase();
            //If the item is a folder
            if (contents[i].isFolder) {
                //Check if the item's name is src or source
                if (currentItem == "source") {
                    src = "source";
                } else if (currentItem == "src") {
                    src = "src";
                //Otherwise check if it matches something in the the autoImages array
                } else {
                    for (var j = 0; j < autoImages.length; j++) {
                        if (currentItem == autoImages[j]) {
                            imgFolder = autoImages[j];
                        }
                    }
                }
            }
        }

        // src = "src";
        // imgFolder = "_img";

        if (imgFolder) {
            var projectImageFolder = projectFolder + '/' + imgFolder;
            ugui.helpers.readAFolder(projectImageFolder, function (imgContents) {
                for (var k = 0; k < imgContents.length; k++) {
                    var currentImgItem = imgContents[k].name.toLowerCase();
                    if (imgContents[k].isFolder) {
                        for (var l = 0; l < autoImages.length; l++) {
                            if (currentImgItem == autoImages[l]) {
                                imgFolder = imgFolder + '/' + autoImages[l];
                            }
                        }
                    }
                }
            });
        }

        // src = "src";
        // imgFolder = "_img/meta";

        if (src && !imgFolder) {
            var srcFolder = projectFolder + '/' + src;
            ugui.helpers.readAFolder(srcFolder, function (srcContents) {
                for (var m = 0; m < srcContents.length; m++) {
                    var currentSrcItem = srcContents[m].name.toLowerCase();
                    if (srcContents[m].isFolder) {
                        for (var n = 0; n < autoImages.length; n++) {
                            if (currentSrcItem == autoImages[n]) {
                                imgFolder == src + '/' + autoImages[n];
                            }
                        }
                        // src = "src";
                        // imgFolder = "src/_img";
                        if (imgFolder) {
                            var srcImgFolder = projectFolder + '/' + imgFolder;
                            ugui.helpers.readAFolder(srcImgFolder, function (SIcontents) {
                                for (var o = 0; o < SIcontents.length; o++) {
                                    var SIcurrentItem = SIcontents[o].name.toLowerCase();
                                    if (SIcontents[o].isFolder) {
                                        for (var p = 0; p < autoImages.length; p++) {
                                            if (SIcurrentItem == autoImages[p]) {
                                                imgFolder = imgFolder + '/' + autoImages[p];
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }

        // src = "src";
        // imgFolder = "src/_img/meta";
        if (imgFolder) {
            scout.newProject.imageFolder = projectFolder + '/' + imgFolder;
        } else {
            scout.newProject.imageFolder = "";
        }

    });
}

function autoGuessProjectIcon (commonImages) {
    var imgFolder = scout.newProject.imageFolder;
    var defaultIcon = "_img/logo_128.png";
    //If there is no imageFolder
    if (imgFolder.length < 1) {
        //user the Scout-App icon
        scout.newProject.projectIcon = defaultIcon;
        return;
    }

    ugui.helpers.readAFolder(imgFolder, function (contents) {
        var projectIcon = defaultIcon;
        //Set the size for each image
        for (var i = 0; i < contents.length; i++) {
            var currentItem = contents[i].name.toLowerCase();
            if (contents[i].isFolder == false) {
                for (var j = 0; j < commonImages.length; j++) {
                    if (currentItem == commonImages[j]){
                        projectIcon = imgFolder + '/' + commonImages[j];
                    }
                }
            }
        }

        //Attempt favicon.ico if no image was found
        if (projectIcon.length < 1) {
            var favicon = scout.newProject.projectFolder + '/favion.ico';
            var srcFav = scout.newProject.projectFolder + '/src/favion.ico';
            var distFav = scout.newProject.projectFolder + '/dist/favion.ico';
            ugui.helpers.getFileSize(favicon, function (fileSize, err) {
                if (!err) {
                    if (fileSize.bytes > 1) {
                        projectIcon = favicon;
                    } else {
                        ugui.helpers.getFileSize(srcFav, function (srcFileSize, srcErr) {
                            if (!srcErr) {
                                if (srcFileSize.bytes > 1) {
                                    projectIcon = srcFav;
                                } else {
                                    ugui.helpers.getFileSize(distFav, function (distFileSize, distErr) {
                                        if (!distErr) {
                                            if (distFileSize > 1) {
                                                projectIcon = distFav;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        scout.newProject.projectIcon = projectIcon;
    });
}

$("#addProject, #file-newproject").click(function (event) {
    event.preventDefault();
    $("#addProjectBrowse").click();
});

$("#addProjectBrowse").change(function () {
    resetProjectSettingsUI();

    //Array items are ordered from lowest to highest priority
    var autoInput = [ "scss", "sass", "_scss", "_sass" ];
    var autoOutput = [ "css", "styles", "style", "_css", "_styles", "_style" ];
    var autoImages = [ "graphics", "images", "image", "imgs", "img", "meta", "_graphics", "_images", "_image", "_imgs", "_img", "_meta"];
    var commonImages = [ "logo.png", "mstile03wd.png", "apl-str.png", "logo_48.png", "apl-57.png", "mstile01sm.png", "apl-72.png", "logo_256.png", "logo_512.png", "fluid.png", "mstile04lg.png", "mstile02md.png", "apl-144.png", "apl-114.png", "logo_128.png" ];

    //Get the path for the project folder the user selected
    var folder = $("#addProjectBrowse").val();
    scout.newProject.projectFolder = folder;
    //Set it to the New Project object, converting windows slashes to unix
    if (ugui.platform == "win32") {
        scout.newProject.projectFolder = folder.split('\\').join('/');
    }

    //Look for commonly named folders so the user doesn't need to manually do anything
    autoGuessProjectFolders(autoInput, autoOutput);

    if (scout.newProject.inputFolder.length < 1) {
        autoGuessSrcDist('src', autoInput, 'inputFolder');
    }
    if (scout.newProject.outputFolder.length < 1) {
        autoGuessSrcDist('dist', autoOutput, 'outputFolder');
    }

    autoGuessImageFolder(autoImages);
    autoGuessProjectIcon(commonImages);

    //Reset the folder browse box
    $("#addProjectBrowse").val("");

    scout.newProject.projectID = "sa" + Date.now();

    updateProjectSettingsView();
});

/**
 * This Update the UI for the Project Settings.
 * It accepts the an object for the `base` argument
 * that looks like this:
 *
 *    {
 *        "projectID":     "sa0000000000000",
 *        "projectName":   "my-project",
 *        "projectFolder": "~/GitHub/my-project",
 *        "inputFolder":   "~/GitHub/my-project/_sass",
 *        "outputFolder":  "~/GitHub/my-project/_style",
 *        "projectIcon":   "~/GitHub/my-project/_img/meta/logo.png",
 *        "environment":   "production",
 *        "outputStyle":   "compressed"
 *    }
 *
 */
function updateProjectSettingsView (base) {
    var base = base || scout.newProject;
    $("#projectIcon"  ).attr('src', base.projectIcon);
    $("#projectName"  ).html(       base.projectName);
    $("#projectFolder").val(        base.projectFolder);
    $("#inputFolder"  ).val(        base.inputFolder);
    $("#outputFolder" ).val(        base.outputFolder);

    var workingDir = base.projectFolder;
    if (ugui.platform == "win32") {
        workingDir = workingDir.split('/').join('\\');
    }

    $("#inputFolderBrowse" ).attr('nwworkingdir', workingDir);
    $("#outputFolderBrowse").attr('nwworkingdir', workingDir);

    var outputStyleOption = $("#outputStyle option");

    if (base.environment == "production") {
        $('#environment input[data-argName="production"]').click();
    } else if (base.environment == "development") {
        $('#environment input[data-argName="development"]').click();
    }

    for (var i = 1; i < outputStyleOption.length; i++) {
        var current = $(outputStyleOption[i]).val();
        if (base.outputStyle == current) {
            $(outputStyleOption[i]).prop("selected", true);
        }
    }

    scout.helpers.unlockSubmit();
    $("#printConsole .alert, #printConsole .panel").addClass('hide');
}

scout.helpers.updateProjectSettingsView = updateProjectSettingsView;

})();
