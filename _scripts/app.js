
//Wait for the document to load and for ugui.js to run before running your app's custom JS
$(document).ready( runApp );

//Container for your app's custom JS
function runApp() {



    //Allow access to the filesystem
    var fs = require('fs');
    //Pull in Node-Sass
    var sass = require('node-sass');
    var chokidar = require('chokidar');
    var nodeSassVersion = sass.info.split('\r\n')[0].replace('node-sass','').replace('(Wrapper)','').replace('[JavaScript]','').trim();
    var libSassVersion = sass.info.split('\r\n')[1].replace('libsass', '').replace('(Sass Compiler)','').replace('[C/C++]','').trim();


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
                var line1 = error.formatted.split('\n')[0].split(':');
                var line2 = error.formatted.split('\n')[1].trim().split(': ');
                var line3 = error.formatted.split('\n')[2].trim().replace('on line ','').split(' of ');
                var title = '<strong>Error:</strong>' + line1[1] + ' <strong>' + line1[2].trim() + '</strong>';
                var footer = line2[0];
                var file = line2[1];
                var bugLine = parseInt(line3[0]);
                var bugFile = line3[1];

                var fileContents = ugui.helpers.readAFile(file);
                fileContents = fileContents.split('\n');
                var count = fileContents.length;
                var theError = '<span class="text-primary">' + (bugLine-1) + ': ' + fileContents[(bugLine-1)] + '</span>';
                var errorPreview = theError;
                //Make sure there are at least 3 lines in the file and the error isn't on the first or last line
                if (count > 3 && (bugLine-1) !== 0 && (bugLine) !== count) {
                    errorPreview =
                      //line before the error
                      (bugLine-2) + ': ' + fileContents[(bugLine-2)] +
                      theError +
                      //line after the error
                      bugLine + ': ' + fileContents[bugLine];
                }
                var formmatedError =
                    '<div class="panel panel-primary">' +
                      '<div class="panel-heading">' +
                        '<span class="pull-right glyphicon glyphicon-remove"></span>' +
                        '<h3 class="panel-title">' + title + '</h3>' +
                      '</div>' +
                      '<div class="panel-body">' +
                        '<strong>' + bugFile + '</strong><br />' +
                        '<pre>' +
                          '<code>' +
                            errorPreview +
                          '</code>' +
                        '</pre>' +
                      '</div>' +
                      '<div class="panel-footer">' +
                        footer + ': <em>' + file + '</em><br />' +
                      '</div>' +
                    '</div>';
                $("#printConsole").append(formmatedError);
                $("#printConsole .glyphicon-remove").click( function () {
                    $(this).parent().parent().remove();
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




    //Set the default starting folder for browse boxes
    var projectFolder = $("#projectFolder").val();
    $("#inputFolderBrowse").attr("nwworkingdir", projectFolder);
    $("#outputFolderBrowse").attr("nwworkingdir", projectFolder);

    $("#inputFolderIcon" ).click( function () { $("#inputFolderBrowse" ).click(); });
    $("#outputFolderIcon").click( function () { $("#outputFolderBrowse").click(); });

    $("#inputFolderBrowse").change(function(){
        var newDir = $("#inputFolderBrowse").val();
        newDir = newDir.split('\\').join('\/');
        $("#inputFolder").val(newDir);
        unlockSubmit();
    });
    $("#outputFolderBrowse").change(function(){
        var newDir = $("#outputFolderBrowse").val();
        newDir = newDir.split('\\').join('\/');
        $("#outputFolder").val(newDir);
        unlockSubmit();
    });

    $("#inputFolderBrowse, #outputFolderBrowse").keyup( unlockSubmit );
    $("#inputFolderBrowse, #outputFolderBrowse").mouseup( unlockSubmit );

    function unlockSubmit () {
        //If a required element wasn't filled out in the form
        if ( $("#project-settings form").is(":invalid") ) {
            //Disable/Lock the submit button
            $("#runScout").prop("disabled", true);
        //If all required elements in the form have been fulfilled
        } else {
            //Enable/Unlock the submit button
            $("#runScout").prop("disabled", false);
        }
    }

    //On page load have this run once
    unlockSubmit();

    $('.nodeSassVersion').html('(Node-Sass v' + nodeSassVersion +  ' / LibSass v' + libSassVersion + ')');


}// end runApp();
