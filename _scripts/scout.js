$(document).ready(function() {







//Allow access to the filesystem
var fs = require('fs');
//Pull in Node-Sass
var sass = require('node-sass');




//When the user clicks "Start!"
$("#runScout").click(function(){
    var inputPath = $("#inputFolderBrowse").val();
    processInputFolder(inputPath);
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

function processInputFolder(inputPath) {
    //Grab all the files in the input folder and put them in an array
    var allSassFiles = fs.readdir(inputPath, function(err, files) {
        //if that works
        if (!err) {
            //check each file and process it if it is sass or scss and doesn't start with an underscore
            for (var i = 0; i < files.length; i++) {
                var currentFile = files[i];

                //Skip all files that begin with an _
                if (!currentFile.startsWith("_")){

                    //Process all sass files
                    if (currentFile.endsWith(".sass")) {
                        //Slice off the ".sass" from "file.sass" to just make "file"
                        inputFileName = currentFile.slice(0,-5);
                        //send to be converted to css and spit out into the output folder
                        convertToCSS(inputFileName, ".sass");

                    //Process all .scss files
                    } else if (currentFile.endsWith(".scss")) {
                        //Slice off the ".scss" from "file.scss" to just make "file"
                        inputFileName = currentFile.slice(0,-5);
                        //send to be converted to css and spit out into the output folder
                        convertToCSS(inputFileName, ".scss");
                    }

                }
            }
        } else {
            console.warn("Could not return list of files from input folder.");
        }
    });
}







function convertToCSS(inputFileName, inputFileExt) {
    var outputFilePath = $("#outputFolderBrowse").val();
    var outputStyle = $('input[name="outputStyle"]').val();
    //Use node-sass to convert sass or scss to css
    sass.render({
        file: '"' + inputPath + inputFileName + inputFileExt + '"',
        outputStyle: outputStyle
    }, function (error, result) {
        if (error) throw error;
        fs.writeFile('"' + outputFilePath + inputFileName + '.css"', result.css, function (err) {
            if (err) throw err;
        });
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








}); //end onReady
