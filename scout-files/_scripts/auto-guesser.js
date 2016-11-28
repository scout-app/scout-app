
/*
  Handles creating new projects and guessing the input/output folders and project icon.
*/

(function ($, scout, ugui) {

    var fs = require('fs-extra');
    var path = require('path');

    function autoGuessProjectFolders (autoInput, autoOutput) {
        var projectFolder = scout.newProject.projectFolder;
        if (projectFolder.length < 1) {
            return;
        }
        var projectPath = projectFolder + '/';
        var projectName = path.basename(projectFolder);
        var inputFolder = '';
        var outputFolder = '';

        ugui.helpers.readAFolder(projectFolder, function (contents) {
            for (var i = 0; i < contents.length; i++) {
                var currentItem = contents[i];
                if (currentItem.isFolder) {
                    var currentFolder = currentItem.name.toLowerCase();
                    // Autoguess the input folder (sass)
                    for (var j = 0; j < autoInput.length; j++) {
                        if (currentFolder == autoInput[j]) {
                            inputFolder = projectPath + autoInput[j];
                        }
                    }
                    // Autoguess the output folder (css)
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
            scout.newProject = {};
        }

        scout.newProject.projectName = projectName;
        scout.newProject.inputFolder = inputFolder;
        scout.newProject.outputFolder = outputFolder;
    }

    function autoGuessSrcDist (srcDist, autoFolder, newProjectProperty) {
        if (srcDist == 'src') {
            srcDist = [ 'app', 'source', 'src', 'scout-files' ];
        } else if (srcDist == 'dist') {
            srcDist = [ 'built', 'public', 'distribution', 'production', 'prod', 'build', 'dist', 'scout-files' ];
        } else {
            srcDist = [ 'app', 'built', 'public', 'distribution', 'production', 'prod', 'build', 'source', 'dist', 'src', 'scout-files' ];
        }

        var projectPath = scout.newProject.projectFolder;

        ugui.helpers.readAFolder(projectPath, function (contents) {
            // loop through C:/myproj/*
            for (var i = 0; i < contents.length; i++) {
                var currentItem = contents[i].name.toLowerCase();
                // only proceed if it's a folder
                if (contents[i].isFolder) {
                    // loop through ['src','source'] or ['dist', 'build']
                    for (var j = 0; j < srcDist.length; j++) {
                        // subfolder = src
                        var subfolder = srcDist[j];
                        // if thing in project folder is what we are looking for: C:/myproj/src
                        if (currentItem == subfolder) {
                            // read folder C:/myproj/src/ or C:/myproj/dist
                            ugui.helpers.readAFolder(projectPath + '/' + subfolder, function (SDContents) {
                                // loop through C:/myproj/src/*
                                for (var k = 0; k < SDContents.length; k++) {
                                    var SDCurrentItem = SDContents[k].name.toLowerCase();
                                    // only proceed if a folder
                                    if (SDContents[k].isFolder) {
                                        // loop through ['sass', 'scss'] or ['styles', 'css']
                                        for (var l = 0; l < autoFolder.length; l++) {
                                            // Current item we are looping through
                                            var subsubfolder = autoFolder[l];
                                            // If the actual folder matches the item being looped
                                            if (SDCurrentItem == subsubfolder) {
                                                // Create the full path to the found folder
                                                var path = projectPath + '/' + subfolder + '/' + SDContents[k].name;
                                                // Update the scout new project object
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
            var publicName = false;
            var imgFolder = false;

            // Loop throught the contents of the project folder
            for (var i = 0; i < contents.length; i++) {
                var currentItem = contents[i].name.toLowerCase();
                // If the item is a folder
                if (contents[i].isFolder) {
                    // Check if the item's name is src or source
                    if (currentItem == 'source') {
                        src = 'source';
                    } else if (currentItem == 'src') {
                        src = 'src';
                    } else if (currentItem == 'public') {
                        publicName = 'public';
                    // Otherwise check if it matches something in the the autoImages array
                    } else {
                        for (var j = 0; j < autoImages.length; j++) {
                            if (currentItem == autoImages[j]) {
                                imgFolder = autoImages[j];
                            }
                        }
                    }
                }
            }

            // src = 'src';
            // imgFolder = '_img';
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

            // src = 'src';
            // imgFolder = '_img/meta';
            if (src && !imgFolder) {
                var srcFolder = projectFolder + '/' + src;
                ugui.helpers.readAFolder(srcFolder, function (srcContents) {
                    for (var m = 0; m < srcContents.length; m++) {
                        var currentSrcItem = srcContents[m].name.toLowerCase();
                        if (srcContents[m].isFolder) {
                            for (var n = 0; n < autoImages.length; n++) {
                                if (currentSrcItem == autoImages[n]) {
                                    imgFolder = src + '/' + autoImages[n];
                                }
                            }
                            // src = 'src';
                            // imgFolder = 'src/_img';
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

            // publicName = 'public';
            // imgFolder = '_img/meta';
            if (publicName && !imgFolder) {
                var publicFolder = projectFolder + '/' + publicName;
                ugui.helpers.readAFolder(publicFolder, function (publicContents) {
                    for (var m = 0; m < publicContents.length; m++) {
                        var currentPublicItem = publicContents[m].name.toLowerCase();
                        if (publicContents[m].isFolder) {
                            for (var n = 0; n < autoImages.length; n++) {
                                if (currentPublicItem == autoImages[n]) {
                                    imgFolder = publicName + '/' + publicContents[m].name;
                                }
                            }
                            // public = 'public';
                            // imgFolder = 'public/_img';
                            if (imgFolder) {
                                var publicImgFolder = projectFolder + '/' + imgFolder;
                                ugui.helpers.readAFolder(publicImgFolder, function (SIcontents) {
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

            // src = 'src';
            // imgFolder = 'src/_img/meta';
            if (imgFolder) {
                scout.newProject.imageFolder = projectFolder + '/' + imgFolder;
            } else {
                scout.newProject.imageFolder = '';
            }

        });
    }

    function useFavicon () {
        var favicon = scout.newProject.projectFolder + '/favicon.ico';
        var srcFav = scout.newProject.projectFolder + '/src/favicon.ico';
        var distFav = scout.newProject.projectFolder + '/dist/favicon.ico';
        var projectIcon = '_img/logo_128.png';
        if (fs.existsSync(favicon)) {
            projectIcon = favicon;
        } else if (fs.existsSync(srcFav)) {
            projectIcon = srcFav;
        } else if (fs.existsSync(distFav)) {
            projectIcon = distFav;
        }
        return projectIcon;
    }

    function autoGuessProjectIcon (commonImages) {
        var imgFolder = scout.newProject.imageFolder;
        var defaultIcon = '_img/logo_128.png';
        var projectIcon = defaultIcon;
        // If there is an imageFolder
        if (imgFolder.length > 0) {
            ugui.helpers.readAFolder(imgFolder, function (contents) {
                for (var i = 0; i < contents.length; i++) {
                    var currentItem = contents[i].name.toLowerCase();
                    if (contents[i].isFolder == false) {
                        for (var j = 0; j < commonImages.length; j++) {
                            if (currentItem == commonImages[j]) {
                                projectIcon = imgFolder + '/' + contents[i].name;
                            }
                        }
                    }
                }

                // Attempt favicon.ico if no image was found
                if (projectIcon == defaultIcon) {
                    projectIcon = useFavicon();
                }

                scout.newProject.projectIcon = projectIcon;
            });
        } else {
            // attempt the favicon, fallback to Scout-App logo
            projectIcon = useFavicon();
            scout.newProject.projectIcon = projectIcon;
        }
    }

    /**
     * This takes a project input path and auto-guesses all the fields for it, then stores everything on scout.projects array.
     * @param  {string} path     The file path to the project folder
     * @param  {bool}   quick    If this is true, we stop half way through and only return if the project as an input and output folder
     * @param  {number} instance The projectID is sa + current unix time + this number. Prevents duplicate ID names
     * @return {null}            Nothing is returned, when finished this adds a new project to the scout.projects array
     */
    function autoGenerateProject (path, quick, instance) {
        scout.helpers.resetProjectUI();

        // Array items are ordered from lowest to highest priority
        var autoInput = [ 'scss', 'sass', '_scss', '_sass' ];
        var autoOutput = [ 'css', 'stylesheets', 'stylesheet', 'styles', 'style', '_css', '_stylesheets', '_stylesheet', '_styles', '_style' ];
        var autoImages = [ 'graphics', 'images', 'image', 'imgs', 'img', 'meta', '_graphics', '_images', '_image', '_imgs', '_img', '_meta'];
        var commonImages = [ 'favicon.ico', 'logo.png', 'mstile03wd.png', 'apl-str.png', 'logo_48.png', 'logo-48.png', 'logo48.png', 'apl_57.png', 'apl-57.png', 'apl57.png', 'mstile01sm.png', 'apl_72.png', 'apl-72.png', 'apl72.png', 'logo_256.png', 'logo-256.png', 'logo256.png', 'logo_512.png', 'logo-512.png', 'logo512.png', 'fluid.png', 'mstile04lg.png', 'mstile02md.png', 'apl_144.png', 'apl-144.png', 'apl144.png', 'apl_114.png', 'apl-114.png', 'apl114.png', 'logo_128.png', 'logo-128.png', 'logo128.png' ];

        // Get the path for the project folder the user selected
        var folder = path || $('#addProjectBrowse').val();
        scout.newProject.projectFolder = folder;
        // Set it to the New Project object, converting windows slashes to unix
        if (process.platform == 'win32') {
            scout.newProject.projectFolder = folder.split('\\').join('/');
        }

        // Look for commonly named folders so the user doesn't need to manually do anything
        autoGuessProjectFolders(autoInput, autoOutput);

        if (scout.newProject.inputFolder.length < 1) {
            autoGuessSrcDist('src', autoInput, 'inputFolder');
        }
        if (scout.newProject.outputFolder.length < 1) {
            autoGuessSrcDist('dist', autoOutput, 'outputFolder');
        }

        if (quick) {
            return scout.newProject;
        }
        autoGuessImageFolder(autoImages);
        autoGuessProjectIcon(commonImages);

        // Reset the folder browse box
        $('#addProjectBrowse').val('');

        if (instance && typeof(instance) == 'number') {
            scout.newProject.projectID = 'sa' + (Date.now() + instance);
        } else {
            scout.newProject.projectID = 'sa' + Date.now();
        }

        scout.helpers.addProject(scout.newProject);
        scout.helpers.unlockSubmit(scout.newProject.projectID);

        scout.helpers.updateProjectSettingsView();
        scout.helpers.ftux();
    }

    // If the user clicks on the add project button in the nav, sidebar, ftux, or the drag n' drop zone on ftux
    $('#addProject, #file-newproject, #ftux-bordered, #ftux-add-project').click(function (event) {
        event.preventDefault();
        $('#addProjectBrowse').click();
    });

    $('#addProjectBrowse').change(function () {
        autoGenerateProject();
    });

    // scout.helpers.autoGenerateProject('C:/Projects/MyProject');
    window.scout.helpers.autoGenerateProject = autoGenerateProject;

})(window.$, window.scout, window.ugui);
