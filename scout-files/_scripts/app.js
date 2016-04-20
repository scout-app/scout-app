
/*
  The main code that handles watching and processing files.
*/

(function runApp() {





    /////////////////////////////////////////////////////////////
    // Define some variables                                   //
    /////////////////////////////////////////////////////////////


    //Pull in Node-Sass
    var sass = require('node-sass');
    //Chokidar allows for watching files
    var chokidar = require('chokidar');

    //Get versions
    scout.versions.nodeSass = sass.info.split('\n')[0].replace('node-sass','').replace('(Wrapper)','').replace('[JavaScript]','').trim();
    scout.versions.libSass  = sass.info.split('\n')[1].replace('libsass', '').replace('(Sass Compiler)','').replace('[C/C++]','').trim();
    if (process.platform == "win32") {
        var pathToProject = ugui.app.pathToProject.replace('/','').split('/').join('\\').split('%20').join(' ');
        scout.versions.chokidar = require(pathToProject + 'node_modules\\chokidar\\package.json').version;
    } else {
        scout.versions.chokidar = require(ugui.app.pathToProject.split('%20').join(' ') + 'node_modules/chokidar/package.json').version;
    }
    $('.nodeSassVersion').html('(Node-Sass v' + scout.versions.nodeSass +  ' / LibSass v' + scout.versions.libSass + ')');
    $('.chokidarVersion').html('v' + scout.versions.chokidar);




    function processInputFolder (project) {
        //Grab all the files in the input folder and put them in an array
        ugui.helpers.readAFolder(project.inputFolder, function (contents) {
            //check each file and process it if it is sass or scss and doesn't start with an underscore
            for (var i = 0; i < contents.length; i++) {
                var currentFile = contents[i].name.toLowerCase();
                //Skip all files that begin with an _ and Process all sass/scss files
                if ( !currentFile.startsWith("_") && (currentFile.endsWith(".sass") || currentFile.endsWith(".scss")) ) {
                    //Change from 'some-file.scss' to 'some-file'
                    var fileName = currentFile.slice(0,-5);
                    //Change from 'some-file.scss' to '.scss'
                    var extension = currentFile.substring(currentFile.length - 5, currentFile.length);
                    //send to be converted to css and spit out into the output folder
                    convertToCSS(project, fileName, extension);
                }
            }
        });
    }

    function convertToCSS (project, inputFileName, inputFileExt) {
        var slash = "/";
        if (process.platform == "win32") {
            slash = "\\";
        }
        var outputStyle = project.outputStyle;
        var sourceMap = false;
        var pathToProject = ugui.app.pathToProject;
        //Get the mixins config file
        var mixins = ugui.helpers.readAFile('scout-files/mixins/mixins.config');
        //put split based on returns
        if (process.platform == "win32") {
            mixins = mixins.split('\r\n');
            pathToProject = pathToProject.replace("/","");
        } else {
            mixins = mixins.split('\n');
        }

        //Remove empty strings from the array
        mixins = mixins.filter(Boolean);

        //Prepend all mixin paths with the path to the Scout-App folder
        for (var i = 0; i < mixins.length; i++) {
            mixins[i] = pathToProject + mixins[i];
        }

        var devMode = false;
        //project.environment will return "production" or "development"
        if (project.environment == "development") {
            devMode = true;
        }
        //If user selected Development (not production)
        if (devMode) {
            //set the location for the sourceMap
            sourceMap = project.outputFolder + slash + inputFileName + '.map'
        }

        var fullFilePath = project.inputFolder + slash + inputFileName + inputFileExt;
        var outputFullFilePath = project.outputFolder + slash + inputFileName + '.css';

        //Use node-sass to convert sass or scss to css
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
                console.log(error);
                scout.helpers.alert(error, projectID);
            } else {
                ugui.helpers.writeToFile(outputFullFilePath, result.css.toString());
                if (devMode) {
                    ugui.helpers.writeToFile(sourceMap, result.map.toString());
                }
                scout.helpers.message(result, projectID);
            };
        });
    }

    function startWatching (id) {
        //loop through all projects to find the one that matches
        for (var i = 0; i < scout.projects.length; i++) {
            //This is to preserve the correct index number for the watcher below.
            //The string version is a copy of the index and thus does not get manipulated by the i++.
            //It is naturally coerced from string to number.
            var I = i.toString();

            //If the ID's match
            if (scout.projects[I].projectID == id) {
                //Create a chokidar watcher in that project
                scout.projects[I].watcher = chokidar.watch(scout.projects[I].inputFolder, {
                    ignored: /[\/\\]\./,
                    persistent: true
                });
                //Detect file changes and reprocess Sass files
                scout.projects[I].watcher
                    .on('change', function (item, stats) {
                        //TODO: See if it's possible to only report changed files
                        //console.log(item);
                        //console.log(stats);
                        //debugger;
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
                            console.log("There was an error watching the input files: ", error);
                        }
                    });
                //Update icon
                scout.projects[I].indicator = "stop";
                scout.helpers.updateSidebar();
                processInputFolder(scout.projects[I]);
                return;
            }
        }
    }

    function stopWatching (id) {
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                var actionButtonIcon = $("#sidebar ." + id + " button .glyphicon");
                //fix icon
                if ($(actionButtonIcon).hasClass('glyphicon-stop')) {
                    //Update icon and color in sidebar
                    scout.projects[i].indicator = "play";
                }
                //Stop watching the files for changes
                if (scout.projects[i].watcher) {
                    scout.projects[i].watcher.close();
                    scout.projects[i].watcher = "";
                }
                scout.helpers.updateSidebar();
            }
        }
    }

    //Loop through all projects and stop any of them that are running.
    function killAllWatchers () {
        if (scout.projects.length > 0) {
            for (var i = 0; i < scout.projects.length; i++) {
                if (scout.projects[i].watcher && typeof(scout.projects[i].watcher) == "object") {
                    try {
                        scout.projects[i].watcher.close();
                    } catch (err) {
                        console.info('The watcher for this project is already turned off.');
                    }
                    scout.projects[i].indicator = "play";
                }
            }
            scout.helpers.updateSidebar();
        }
    }

    scout.helpers.processInputFolder = processInputFolder;
    scout.helpers.startWatching = startWatching;
    scout.helpers.stopWatching = stopWatching;
    scout.helpers.killAllWatchers = killAllWatchers;

})(); // end runApp();
