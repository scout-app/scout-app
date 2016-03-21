
//Container for your app's custom JS
(function runApp() {





    /////////////////////////////////////////////////////////////
    // Defin some variables                                    //
    /////////////////////////////////////////////////////////////

    //Pull in Node-Sass
    var sass = require('node-sass');
    //Chokidar allows for watching files
    var chokidar = require('chokidar');
    //Get versions
    ugui.app.nodeSass = sass.info.split('\n')[0].replace('node-sass','').replace('(Wrapper)','').replace('[JavaScript]','').trim();
    ugui.app.libSass  = sass.info.split('\n')[1].replace('libsass', '').replace('(Sass Compiler)','').replace('[C/C++]','').trim();





    //When the user clicks "Start!"
    $("#runScout").click( function (event) {
        //Prevent the form from sending like a normal website.
        event.preventDefault();
        //Build the UGUI Args Object
        ugui.helpers.buildUGUIArgObject()
        //Send the folder path to be processed
        var inputFolder = ugui.args.inputFolder.value;
        processInputFolder(inputFolder);
        //monitor inputFolder for changes
        startWatching(inputFolder);
    });

    function processInputFolder (inputPath) {
        //Grab all the files in the input folder and put them in an array
        ugui.helpers.readAFolder(inputPath, function(contents, contentsList) {
            //check each file and process it if it is sass or scss and doesn't start with an underscore
            for (var i = 0; i < contentsList.length; i++) {
                var currentFile = contentsList[i];
                //Skip all files that begin with an _ and Process all sass/scss files
                if ( !currentFile.startsWith("_") && (currentFile.endsWith(".sass") || currentFile.endsWith(".scss")) ) {
                    //Change from 'some-file.scss' to 'some-file'
                    var fileName = currentFile.slice(0,-5);
                    //Change from 'some-file.scss' to '.scss'
                    var extension = currentFile.substring(currentFile.length - 5, currentFile.length);
                    //send to be converted to css and spit out into the output folder
                    convertToCSS(inputPath, fileName, extension);
                }
            }
        });
    }

    function convertToCSS (inputPath, inputFileName, inputFileExt) {
        var slash = "/";
        if (ugui.platform == "win32") {
            slash = "\\";
        }
        var outputFilePath = ugui.args.outputFolder.value;
        var outputStyle = ugui.args.outputStyle.value;
        var sourceMap = false;
        //Get the mixins config file
        var mixins = ugui.helpers.readAFile('mixins' + slash + 'mixins.config');
        //put split based on returns
        mixins = mixins.split('\r\n');
        //Remove empty strings from the array
        mixins = mixins.filter(Boolean);

        //devMode will return true or false
        var devMode = ugui.args.development.htmlticked;
        //If user selected Development (not production)
        if (devMode) {
            //set the location for the sourceMap
            sourceMap = outputFilePath + slash + inputFileName + '.map'
        }

        var fullFilePath = inputPath + slash + inputFileName + inputFileExt;
        var outputFullFilePath = outputFilePath + slash + inputFileName + '.css';

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
            if (error) {
                console.log(error);
                ugui.helpers.alert(error);
            } else {
                ugui.helpers.writeToFile(outputFullFilePath, result.css.toString());
                if (devMode) {
                    ugui.helpers.writeToFile(sourceMap, result.map.toString());
                }
                ugui.helpers.message(result);
            };
        });
    }

    function startWatching (inputFolder) {
        var watcher = chokidar.watch(inputFolder, {
            ignored: /[\/\\]\./,
            persistent: true
        });
        watcher.on('change', function () {
            processInputFolder(inputFolder);
        });
    }

})(); // end runApp();
