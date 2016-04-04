
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
        scout.versions.chokidar = require(ugui.app.pathToProject.split('/').join('\\').replace('\\','') + 'node_modules\\chokidar\\package.json').version;
    } else {
        scout.versions.chokidar = require(ugui.app.pathToProject + 'node_modules/chokidar/package.json').version;
    }




    //When the user clicks "Start!"
    $("#runScout").click( function (event) {
        //Prevent the form from sending like a normal website.
        event.preventDefault();
        processInputFolder(scout.projects[0]);
        //monitor inputFolder for changes
        startWatching(scout.projects[0]);
    });

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
        //Get the mixins config file
        var mixins = ugui.helpers.readAFile('mixins' + slash + 'mixins.config');
        //put split based on returns
        if (process.platform == "win32") {
            mixins = mixins.split('\r\n');
        } else {
            mixins = mixins.split('\n');
        }

        //Remove empty strings from the array
        mixins = mixins.filter(Boolean);

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

    function startWatching (project) {
        //loop through all projects to find the one that matches
        for (var i = 0; i < scout.projects.length; i++) {
            //If the ID's match
            if (project.projectID == scout.projects[i].projectID) {
                //Create a chokidar watcher in that project
                scout.projects[i].watcher = chokidar.watch(project.inputFolder, {
                    ignored: /[\/\\]\./,
                    persistent: true
                });
                //Detect file changes and reprocess Sass files
                scout.projects[i].watcher.on('change', function (item, stats) {
                    //TODO: See if it's possible to only report changed files
                    //console.log(item);
                    //console.log(stats);
                    //debugger;
                    processInputFolder(project);
                });
            }
        }
    }

    scout.helpers.processInputFolder = processInputFolder;
    scout.helpers.startWatching = startWatching;

})(); // end runApp();
