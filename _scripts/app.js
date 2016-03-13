
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
    ugui.app.nodeSass = sass.info.split('\r\n')[0].replace('node-sass','').replace('(Wrapper)','').replace('[JavaScript]','').trim();
    ugui.app.libSass  = sass.info.split('\r\n')[1].replace('libsass', '').replace('(Sass Compiler)','').replace('[C/C++]','').trim();





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





    //Set up ability to use "startsWith" and "endsWith"
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.slice(0, str.length) == str;
        };
    }
    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function (str){
            return this.slice(-str.length) == str;
        };
    }

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
        //If we are in Development (not production)
        if (devMode) {
            //Convert compact setting to nested so source maps will work
            if (outputStyle == 'compact') {
                outputStyle = 'nested';
            //and compressed to expanded so source maps will work
            } else if (outputStyle == 'compressed') {
                outputStyle = 'expanded';
            }
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
                var file = error.file;
                var bugLine = error.line;
                var col = error.column;
                var code = error.status;
                var title = '<strong>Error (0x0' + code + ')</strong> Line: <strong>' + bugLine + '</strong> Col: <strong>' + col + '</strong>';
                var footer = '<em>' + file + '</em>';
                var bugFile = file.replace('\\','/').split('/');
                bugFile = bugFile[bugFile.length - 1];

                var fileContents = ugui.helpers.readAFile(file);
                fileContents = fileContents.split('\n');
                var count = fileContents.length;

                var theError = '<span class="num">' + bugLine + ':</span> <span class="text-primary">' + fileContents[(bugLine-1)] + '</span>';
                var errorPreview = theError;
                //Replace tabbed returns with bullet points, and regular returns with <BR>'s
                var errorMessage = error.message
                    .replace(/[\r,\n]\s\s/g, '<br /><span class="bullet"></span>')
                    .replace(/[\n\r]/g, '<br />')
                    .replace(file,'');

                //Make sure there are at least 3 lines in the file and the error isn't on the first or last line
                if (count > 3 && (bugLine-1) !== 0 && (bugLine) !== count) {
                    errorPreview =
                      //line before the error
                      '<span class="num">' + (bugLine-1) + ':</span> ' + fileContents[(bugLine-2)] +
                      theError +
                      //line after the error
                      '<span class="num">' + (bugLine+1) + ':</span> ' + fileContents[bugLine];
                }

                var formmatedError =
                    '<div class="panel panel-primary">' +
                      '<div class="panel-heading">' +
                        '<span class="pull-right glyphicon glyphicon-remove"></span>' +
                        '<h3 class="panel-title">' + title + '</h3>' +
                      '</div>' +
                      '<div class="panel-body">' +
                        errorMessage + '<br />' +
                        '<strong>' + bugFile + '</strong><br />' +
                        '<pre>' +
                          '<code>' +
                            errorPreview +
                          '</code>' +
                        '</pre>' +
                      '</div>' +
                      '<div class="panel-footer">' +
                        footer +
                      '</div>' +
                    '</div>';
                $("#printConsole").append(formmatedError);
                $("#printConsole .glyphicon-remove").click( function () {
                    $(this).parent().parent().fadeOut(400, "linear", function () {
                        $(this).remove();
                    });
                });
            } else {
                ugui.helpers.writeToFile(outputFullFilePath, result.css.toString());
                if (devMode) {
                    ugui.helpers.writeToFile(sourceMap, result.map.toString());
                }
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
