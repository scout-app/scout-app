/* eslint-disable no-console */

/*
  The main code that handles watching and processing files.
*/

(function ($, scout, ugui) {

    var fs = require('fs-extra');
    var sass = require('node-sass');
    var chokidar = require('chokidar');
    var path = require('path');

    // Get versions
    scout.versions.nodeSass = sass.info.split('\n')[0].replace('node-sass', '').replace('(Wrapper)', '').replace('[JavaScript]', '').trim();
    scout.versions.libSass = sass.info.split('\n')[1].replace('libsass', '').replace('(Sass Compiler)', '').replace('[C/C++]', '').trim();
    if (process.platform == 'win32') {
        var pathToProject = ugui.app.pathToProject.replace('/', '').split('/').join('\\').split('%20').join(' ');
        scout.versions.chokidar = require(pathToProject + 'node_modules\\chokidar\\package.json').version;
    } else {
        scout.versions.chokidar = require(ugui.app.pathToProject.split('%20').join(' ') + 'node_modules/chokidar/package.json').version;
    }
    $('.nodeSassVersion').html('(Node-Sass v' + scout.versions.nodeSass + ' / LibSass v' + scout.versions.libSass + ')');
    $('.chokidarVersion').html('v' + scout.versions.chokidar);

    // If the input folder does not contain any Sass, then alert the user
    function checkForSassOnce (project, inputSubFolder, hasSassFiles) {
        hasSassFiles = hasSassFiles || false;
        var inputFolder = project.inputFolder;
        if (inputSubFolder) {
            inputFolder = path.join(project.inputFolder, inputSubFolder);
        }
        // Grab all the files in the input folder and put them in an array
        ugui.helpers.readAFolder(inputFolder, function (contents) {
            // check each file and process it if it is sass or scss and doesn't start with an underscore
            for (var i = 0; i < contents.length; i++) {
                var folder = contents[i].isFolder;
                var currentName = contents[i].name;
                if (folder) {
                    var subfolder = currentName;
                    if (inputSubFolder) {
                        subfolder = path.join(inputSubFolder, currentName);
                    }
                    checkForSassOnce(project, subfolder, hasSassFiles);
                // Skip all files that begin with an _ and Process all sass/scss files
                } else if (!currentName.startsWith('_') && (currentName.toLowerCase().endsWith('.sass') || currentName.toLowerCase().endsWith('.scss'))) {
                    hasSassFiles = true;
                }
            }
            project.hasSassFiles = hasSassFiles;
        });
    }

    function processInputFolder (project, inputSubFolder) {
        var inputFolder = project.inputFolder;
        if (inputSubFolder) {
            inputFolder = path.join(project.inputFolder, inputSubFolder);
        }
        // Grab all the files in the input folder and put them in an array
        ugui.helpers.readAFolder(inputFolder, function (contents) {
            // check each file and process it if it is sass or scss and doesn't start with an underscore
            for (var i = 0; i < contents.length; i++) {
                var folder = contents[i].isFolder;
                var currentName = contents[i].name;
                if (folder) {
                    var subfolder = currentName;
                    if (inputSubFolder) {
                        subfolder = path.join(inputSubFolder, currentName);
                    }
                    processInputFolder(project, subfolder);
                // Skip all files that begin with an _ and Process all sass/scss files
                } else if (!currentName.startsWith('_') && (currentName.toLowerCase().endsWith('.sass') || currentName.toLowerCase().endsWith('.scss'))) {
                    // Change from 'some-file.scss' to 'some-file'
                    var fileName = currentName.slice(0, -5);
                    // Change from 'some-file.scss' to '.scss'
                    var extension = currentName.substring(currentName.length - 5, currentName.length);
                    // send to be converted to css and spit out into the output folder
                    convertToCSS(project, fileName, extension, inputSubFolder);
                }
            }
        });
    }

    function convertToCSS (project, inputFileName, inputFileExt, inputSubFolder) {
        var outputSubFolder = inputSubFolder || '';
        var outputStyle = project.outputStyle;
        var pathToProject = ugui.app.pathToProject;
        // Get the mixins config file
        var mixins = ugui.helpers.readAFile('scout-files/mixins/mixins.config');
        // put split based on returns
        if (process.platform == 'win32') {
            mixins = mixins.split('\r\n');
            pathToProject = pathToProject.replace('/', '');
        } else {
            mixins = mixins.split('\n');
        }

        // Remove empty strings from the array
        mixins = mixins.filter(Boolean);

        // Prepend all mixin paths with the path to the Scout-App folder
        for (var i = 0; i < mixins.length; i++) {
            mixins[i] = pathToProject + mixins[i];
            mixins[i] = mixins[i].replace(/%20/g, ' ');
        }

        var devMode = false;
        // project.environment will return "production" or "development"
        if (project.environment == 'development') {
            devMode = true;
        }

        var sourceMap = false;
        // If user selected Development (not production)
        if (devMode) {
            // set the location for the sourceMap
            sourceMap = path.join(project.outputFolder, outputSubFolder, inputFileName + '.map');
        }

        var fullFilePath = path.join(project.inputFolder, outputSubFolder, inputFileName + inputFileExt);
        var outputFullFilePath = path.join(project.outputFolder, outputSubFolder, inputFileName + '.css');

        // Use node-sass to convert sass or scss to css
        sass.render({
            'file': fullFilePath,
            'outfile': sourceMap,
            'outputStyle': outputStyle,
            'indentedSyntax': true,
            'includePaths': mixins,
            'sourceComments': devMode,
            'sourceMap': sourceMap,
            'sourceMapContents': devMode
        }, function (error, result) {
            var projectID = project.projectID;
            if (error) {
                console.warn(error);
                scout.helpers.alert(error, projectID);
            } else {
                fs.outputFile(outputFullFilePath, result.css.toString(), function (err) {
                    if (err) {
                        console.warn(err);
                    }
                });
                if (devMode) {
                    fs.outputFile(sourceMap, result.map.toString(), function (err) {
                        if (err) {
                            console.warn(err);
                        }
                    });
                }
                scout.helpers.message(result, projectID);
            }
        });
    }

    function startWatching (id) {
        // loop through all projects to find the one that matches
        for (var i = 0; i < scout.projects.length; i++) {
            // This is to preserve the correct index number for the watcher below.
            // The string version is a copy of the index and thus does not get manipulated by the i++.
            // It is naturally coerced from string to number.
            var I = i.toString();

            // If the ID's match
            if (scout.projects[I].projectID == id) {
                // Create a chokidar watcher in that project
                scout.projects[I].watcher = chokidar.watch(scout.projects[I].inputFolder, {
                    ignored: /[\/\\]\./,
                    persistent: true
                });
                // Detect file changes and reprocess Sass files
                scout.projects[I].watcher
                    .on('change', function (/* item, stats*/) {
                        // TODO: See if it's possible to only report changed files
                        // console.log(item);
                        // console.log(stats);
                        // debugger;
                        processInputFolder(scout.projects[I]);
                    })
                    .on('error', function (error) {
                        if (error.toString().toUpperCase().indexOf('ENOSPC') > -1) {
                            console.info('Looks like you are watching more files than your OS allows by default.');
                            console.info('To increase the amount of files that can be watched by a user, run:');
                            console.info('echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p');
                            console.info('The above command came from:');
                            console.info('https://discourse.roots.io/t/gulp-watch-error-on-ubuntu-14-04-solved/3453/2');
                            require('nw.gui').Window.get().showDevTools();
                        } else {
                            console.log('There was an error watching the input files: ', error);
                        }
                    });
                // Update icon
                scout.projects[I].indicator = 'stop';
                scout.helpers.updateSidebar();
                checkForSassOnce(scout.projects[I]);
                if (!scout.projects[I].hasSassFiles) {
                    id = scout.projects[I].projectID;
                    var msg = scout.localize('NO_SASS_FILES');
                    var err = {
                        'folder': scout.projects[I].inputFolder,
                        'line': 0,
                        'column': 0,
                        'status': 0,
                        'formatted': msg,
                        'message': msg,
                        'name': 'Error'
                    };
                    scout.helpers.warn(err, id);
                }
                processInputFolder(scout.projects[I]);
                return;
            }
        }
    }

    function stopWatching (id) {
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                var actionButtonIcon = $('#sidebar .' + id + ' button .glyphicon');
                // fix icon
                if ($(actionButtonIcon).hasClass('glyphicon-stop')) {
                    // Update icon and color in sidebar
                    scout.projects[i].indicator = 'play';
                }
                // Stop watching the files for changes
                if (scout.projects[i].watcher) {
                    scout.projects[i].watcher.close();
                    scout.projects[i].watcher = '';
                }
                scout.helpers.updateSidebar();
            }
        }
    }

    // Loop through all projects and stop any of them that are running.
    function killAllWatchers () {
        if (scout.projects.length > 0) {
            for (var i = 0; i < scout.projects.length; i++) {
                if (scout.projects[i].watcher && typeof(scout.projects[i].watcher) == 'object') {
                    try {
                        scout.projects[i].watcher.close();
                    } catch (err) {
                        console.info('The watcher for this project is already turned off.');
                    }
                    scout.projects[i].indicator = 'play';
                }
            }
            scout.helpers.updateSidebar();
        }
    }

    scout.helpers.processInputFolder = processInputFolder;
    scout.helpers.startWatching = startWatching;
    scout.helpers.stopWatching = stopWatching;
    scout.helpers.killAllWatchers = killAllWatchers;

})(window.$, window.scout, window.ugui);
