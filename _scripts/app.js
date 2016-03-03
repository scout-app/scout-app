
//Wait for the document to load and for ugui.js to run before running your app's custom JS
$(document).ready( runApp );

//Container for your app's custom JS
function runApp() {



    //Allow access to the filesystem
    var fs = require('fs');
    //Pull in Node-Sass
    var sass = require('node-sass');



    //When the user clicks "Start!"
    $("#runScout").click( function (event) {
        //Prevent the form from sending like a normal website.
        event.preventDefault();
        //Build the UGUI Args Object
        ugui.helpers.buildUGUIArgObject()
        //Send the folder path to be processed
        processInputFolder(ugui.args.inputFolder.value);
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
        var outputFilePath = ugui.args.outputFolder.value;
        var outputStyle = ugui.args.outputStyle.value;
        var slash = "/";
        if (ugui.platform == "win32") {
            slash = "\\";
        }
        var fullFilePath = inputPath + slash + inputFileName + inputFileExt;
        var outputFullFilePath = inputPath + slash + inputFileName + '.css';
        //Use node-sass to convert sass or scss to css
        sass.render({
            'file': fullFilePath,
            'outputStyle': outputStyle,
            'indentedSyntax': true,
            'includePaths': ['mixins']
        }, function (error, result) {
            if (error) {
                console.log(error);
                $("#printConsole").html(error);
            } else {
                ugui.helpers.writeToFile(outputFullFilePath, result.css.toString());
            };
        });
    }







    //resize folder browse buttons to be same size as [...] buttons that are covering them
    var bttnWidth = $(".inputDirectoryBttn").outerWidth(true);
    var bttnHeight = $(".inputDirectoryBttn").outerHeight(true);
    $("input[nwdirectory]").outerWidth(bttnWidth);
    $("input[nwdirectory]").outerHeight(bttnHeight);

    //Set the default starting folder for browse boxes
    var projectFolder = $("#projectFolder").val();
    $("#inputFolderBrowse").attr("nwworkingdir", projectFolder);
    $("#outputFolderBrowse").attr("nwworkingdir", projectFolder);
    $("#jsFolderBrowse").attr("nwworkingdir", projectFolder);
    $("#imgFolderBrowse").attr("nwworkingdir", projectFolder);

    //If a Folder Browse input changes, update the disabled input box to show the folder path
    $("#inputFolderBrowse").change(function(){
        $("#inputFilePath").val( $(this).val() );
    });
    $("#outputFolderBrowse").change(function(){
        $("#outputFilePath").val( $(this).val() );
    });
    $("#jsFolderBrowse").change(function(){
        $("#jsFilePath").val( $(this).val() );
    });
    $("#imgFolderBrowse").change(function(){
        $("#imgFilePath").val( $(this).val() );
    });





}// end runApp();
