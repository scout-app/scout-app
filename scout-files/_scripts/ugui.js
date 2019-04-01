/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable no-constant-condition */
/* eslint-disable no-multi-spaces */
/* eslint-disable spaced-comment */

/*
  UGUI.js is a library and framework that was used to get
  Scout-App up and running very, very quickly. It has
  many helper functions that we use, like for reading and
  creating folders and files.

  Some parts of this file have been modified from the
  original source. We'll be looking at how to better handle
  ugui.js in the future so we won't need to manually update
  each time.
*/






//## TABLE OF CONTENTS
//
//**A00. [Intro](#a00-intro)**  
//**A01**. [UGUI Start](#a01-ugui-start)  
//**A02**. [UGUI variables](#a02-ugui-variables)  
//
//**B00. [Simplified Commands](#b00-simplified-commands)**  
//**B01**. [Run CMD](#b01-run-cmd)  
//**B02**. [Run CMD (Advanced)](#b02-run-cmd-advanced-)  
//**B03**. [Read a file](#b03-read-a-file)  
//**B04**. [Read a folder](#b04-read-contents-of-a-folder)  
//**B05**. [Write to file](#b05-write-to-file)  
//**B06**. [Create a folder](#b06-create-a-folder)  
//**B07**. [Delete a file](#b07-delete-a-file)  
//**B08**. [Delete a folder](#b08-delete-a-folder)  
//**B09**. [Get file size](#b09-get-a-file-s-size)  
//**B10**. [Set zoom percent](#b10-set-zoom-percent)  
//**B11**. [Open Folder](#b11-open-folder)  
//
//**C00. [CLI Command Processing](#c00-cli-command-processing)**  
//**C01**. [Clicking Submit](#c01-clicking-submit)  
//**C02**. [Building the command array](#c02-building-the-command-array)  
//**C03**. [Build UGUI Args object](#c03-build-ugui-arg-object)  
//**C04**. [Find key value](#c04-find-key-value)  
//**C05**. [Parse argument](#c05-parse-argument)  
//**C06**. [Process all <cmd> definitions](#c06-process-all-cmd-definitions)  
//**C07**. [Convert command array to string](#c07-convert-command-array-to-string)  
//**C08**. [Set input file path, file name, and extension](#c08-set-input-file-path-file-name-and-extension)  
//**C09**. [Set input folder path and folder name](#c09-set-input-folder-path-and-folder-name)  
//**c10**. [Prevent user from entering quotes in forms](#c10-prevent-user-from-entering-quotes-in-forms)  
//**C11**. [Color processor](#c11-color-processor)  
//
//**D00. [UI Elements](#d00-ui-elements)**  
//**D01**. [Submit is locked until required is fulfilled](#d01-submit-locked-until-required-fulfilled)  
//**D02**. [Replace HTML text with text from package.json](#d02-replace-html-text-with-text-from-package-json)  
//**D03**. [Update about modal](#d03-update-about-modal)  
//**D04**. [Navigation bar functionality](#d04-navigation-bar-functionality)  
//**D05**. [Launch links in default browser](#d05-launch-links-in-default-browser)  
//**D06**. [Check for Updates](#d06-check-for-updates)  
//
//**E00. [Warnings](#e00-warnings)**  
//**E01**. [Warn if identical data-argNames](#e01-warn-if-identical-data-argnames)  
//
//**F00. [UGUI Developer Toolbar](#f00-ugui-developer-toolbar)**  
//**F01**. [Detect if in developer environment](#f01-detect-if-in-developer-environment)  
//**F02**. [Put all executables in dropdowns](#f02-put-all-executables-in-dropdowns)  
//**F03**. [Real-time updating of command output in UGUI Dev Tools](#f03-real-time-updating-dev-tool-command-output)  
//**F04**. [Put CLI help info in UGUI dev tools](#f04-put-cli-help-info-in-ugui-dev-tools)  
//**F05**. [Swap Bootswatches](#f05-swap-bootswatches)  
//**F06**. [Save chosen Bootswatch](#f06-save-chosen-bootswatch)  
//**F07**. [Custom keyboard shortcuts](#f07-custom-keyboard-shortcuts)  
//
//**G00. [Plugins](#g00-plugins)**  
//**G01**. [EZDZ: Drag and drop file browse box](#g01-ezdz-drag-and-drop)  
//**G02**. [Range slider](#g02-range-slider)  
//**G03**. [Cut/copy/paste context menu](#g03-cut-copy-paste-context-menu)  
//**G04**. [Open New Window](#g04-open-new-window)  
//
//**H00. [Settings](#h00-settings)**  
//**H01**. [Save Settings](#h01-save-settings)  
//**H02**. [Load Settings](#h02-load-settings)  
//**H03**. [The UGUI Object](#h03-the-ugui-object)  














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## A00. Intro
//
//This is the start of the file. We have UGUI wait until the
//document is ready before performing any actions. We've also
//added in a way to delay the running of UGUI until Webkit
//Developer Tools can launch. This will allow you to hit a
//debugger in time, if contributing to UGUI.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *








//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### A01. UGUI Start
//
/*
//Wait for the document to load before running ugui.js. Use either runUGUI or waitUGUI for immediate or delayed launch.
$(document).ready(runUGUI);

//This lets you open NW.js, then immediately launch the Webkit Developer Tools, then a few seconds later run UGUI.
//Good for hitting a debugger in time, as often the JS runs before the Webkit Developer Tools can open.
function waitUGUI() {
    require('nw.gui').Window.get().showDevTools();
    setTimeout(runUGUI, 6000);
}

*/
//Container for all UGUI components
(function runUGUI (window, $) {

//This is the one place where the UGUI version is declared
var uguiVersion = '2.0.0a';







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### A02. UGUI Variables
//
//>Listing of variables used throughout this library.

//All arguments sent in the command
var allArgElements = $('cmd arg');

//This is used by for loops throughout this file
var index = 0;

//All executables gathered from the `<cmd>` blocks
var executable = [];
for (index = 0; index < $('cmd').length; index++) {
    var currentCommandBlock = $('cmd')[index];
    executable.push($(currentCommandBlock).attr('executable'));
}

//Create the argsForm array containing all elements with a `data-argName` for each executable form.
var argsForm = [];
for (index = 0; index < executable.length; index++) {
    argsForm.push($('#' + executable[index] + ' *[data-argName]'));
}

//Get all text fields where a single or double quoatation mark could be entered
var textFields = $('textarea[data-argName], input[data-argName][type=text]').toArray();

//Allow access to the filesystem
var fs = require('fs-extra');

//Access the contents of the package.json file
var packageJSON = require('nw.gui').App.manifest;

//Name of the developer's application as a URL/File path safe name, set in package.json
var appName = packageJSON.name;

//The app title that is used dynamically throughout the UI and title bar, set in package.json
var appTitle = packageJSON.window.title;

//Version of the developer's application, set in package.json
var appVersion = packageJSON.version;

//Description or tagline for application, set in package.json
var appDescription = packageJSON.description;

//Name of the app developer or development team, set in package.json
var authorName = packageJSON.author;

//Name of the starting page for the app, set in package.json
var indexFile = packageJSON.main;

//Full path to the app project folder
var pathToProject = window.location.pathname.split(indexFile)[0];

//Detect if in `darwin`, `freebsd`, `linux`, `sunos`, or `win32`
var platform = process.platform;

//If you're on Windows then folders in file paths are separated with `\`, otherwise OS's use `/`
var correctSlash = '/';
if (platform == 'win32') {
    correctSlash = '\\';
} else {
    correctSlash = '/';
}

//Detect if Bootstrap is loaded
var bootstrap3_enabled = (typeof $().emulateTransitionEnd == 'function');

//Detect if Bootstrap Slider is loaded
var slider_enabled = (typeof $().slider == 'function');

//You can stylize console outputs in Webkit, these are essentially CSS classes
var consoleNormal = 'font-family: sans-serif';
var consoleBold   = 'font-family: sans-serif;' +
                    'font-weight: bold';
var consoleCode   = 'background: #EEEEF6;' +
                    'border: 1px solid #B2B0C1;' +
                    'border-radius: 7px;' +
                    'padding: 2px 8px 3px;' +
                    'color: #5F5F5F;' +
                    'line-height: 22px;' +
                    'box-shadow: 0px 0px 1px 1px rgba(178,176,193,0.3)';
var consoleError  = 'background: #F6EEEE;' +
                    'border: 1px solid #C1B0B2;' +
                    'border-radius: 7px;' +
                    'padding: 2px 8px 3px;' +
                    'color: #5F5F5F;' +
                    'line-height: 22px;' +
                    'box-shadow: 0px 0px 1px 1px rgba(193,176,178,0.3)';

//Placing this at the start of a console output will let you style it.  
//**Example**: `console.info(º + 'Some bold text.', consoleBold);`
var º = '%c';

//Make sure the `ugui` and `ugui.args` objects exist, if not create them
if (!window.ugui) {
    window.ugui = {};
    window.ugui.args = {};
}

var ugui = window.ugui;













//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## B00. Simplified Commands
//
//These are easy to run commands for common tasks a desktop
//application would perform. Such as reading, writing, and
//deleting files and folders or running native executables.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B01. Run CMD
//
//>This is what makes running your CLI program and arguments
// easier. Cow & Taco examples below to make life simpler.
//>
//
//>     $('#taco').click(function () {
//         runcmd('pngquant --force "file.png"');
//     });
//
//>     runcmd('node --version', function (data) {
//         $('#cow').html('<pre>Node Version: ' + data + '</pre>');
//     });

//
function runcmd (executableAndArgs, callback) {
    //Validate that the required argument is passed and is a string
    if (!executableAndArgs || typeof(executableAndArgs) !== 'string') {
        console.info(º + 'You must pass in a string containing the exectuable ' +
            'and arguments to be sent to the command line.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.runcmd("pngquant.exe --speed 11mph --force file.png");', consoleCode);
        return;
    }

    var exec = require('child_process').exec;
    var child = exec(executableAndArgs,
        //Throw errors and information into console
        function (error, stdout, stderr) {
            console.log(executableAndArgs);
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('Executable Error: ' + error);
            }
            console.log('---------------------');
        }
    );
    //Return data from command line
    child.stdout.on('data', function (chunk) {
        if (typeof callback === 'function') {
            callback(chunk);
        }
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B02. Run CMD (Advanced)
//
//>This is a more advanced option for running executables. You
// can pass in a parameters object to get additional
// functionality such as running a function when an executable
// closes, finishes, errors, or returns data.
//
//>     ugui.helpers.runcmdAdvanced(parameters);
//
//>Below is an example parameters object.
//
//>     var parameters = {
//         'executableAndArgs': 'node --version',
//         'returnedData': function (data) {
//             console.log('The text from the executable: ' + data);
//         },
//         'onExit': function (code) {
//             console.log('Executable finished with the exit code: ' + code);
//         },
//         'onError': function (err) {
//             console.log('Executable finished with the error: ' + err);
//         },
//         'onClose': function (code) {
//             console.log('Executable has closed with the exit code: ' + code);
//         }
//     };

//
function runcmdAdvanced (parameters) {
    //Validate that required argument is passed
    if (!parameters) {
        console.info(º + 'You must pass in an object with your options.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'var parameters = { \'executableAndArgs\': \'node --version\' };', consoleCode);
        console.info(º + 'ugui.helpers.runcmdAdv(parameters);', consoleCode);
        return;
    }
    //Validate types
    if (Object.prototype.toString.call(parameters) !== '[object Object]') {
        console.info(º + 'Your parameters must be passed as an object.', consoleNormal);
        return;
    } else if (typeof(parameters.executableAndArgs) !== 'string') {
        console.info(º + 'Executable and arguments must be passed as a string. Example:', consoleNormal);
        console.info(º + '"node --version"', consoleCode);
        return;
    } else if (parameters.returnedData && typeof(parameters.returnedData) !== 'function') {
        console.info(º + 'returnedData must be a function.', consoleNormal);
        return;
    } else if (parameters.onExit && typeof(parameters.onExit) !== 'function') {
        console.info(º + 'onExit must be a function.', consoleNormal);
        return;
    } else if (parameters.onError && typeof(parameters.onError) !== 'function') {
        console.info(º + 'onError must be a function.', consoleNormal);
        return;
    } else if (parameters.onClose && typeof(parameters.onClose) !== 'function') {
        console.info(º + 'onClose must be a function.', consoleNormal);
        return;
    }

    var exec = require('child_process').exec;
    var child = exec(parameters.executableAndArgs,
        //Throw errors and information into console
        function (error, stdout, stderr) {
            console.log(parameters.executableAndArgs);
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('Executable Error: ' + error);
            } else {
                return child;
            }
            console.log('---------------------');
        }
    );

    //Detect when executable finishes
    child.on('exit', function (code) {
        if (typeof parameters.onExit === 'function') {
            parameters.onExit(code);
        }
    });

    //Detect when executable errors
    child.on('error', function (code) {
        if (typeof parameters.onError === 'function') {
            parameters.onError(code);
        }
    });

    //Detect when the executable is closed
    child.on('close', function (code) {
        if (typeof parameters.onClose === 'function') {
            parameters.onClose(code);
        }
    });

    //Return data from command line
    child.stdout.on('data', function (chunk) {
        if (typeof parameters.returnedData === 'function') {
            parameters.returnedData(chunk);
        }
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B03. Read a file
//
//>A function that allows you to set the contents of a file to
// a variable. Like so:
//
//>     var devToolsHTML = ugui.helpers.readAFile('_markup/ugui-devtools.htm');

//
function readAFile (filePathAndName) {
    //Validate that required argument is passed
    if (!filePathAndName) {
        console.info(º + 'Supply a path to the file you want to read as ' +
            'an argument to this function.', consoleNormal);
        return;
    }
    //Validate types
    if (typeof(filePathAndName) !== 'string') {
        console.info(º + 'File path must be passed as a string.', consoleNormal);
        return;
    }
    var fileData = fs.readFileSync(filePathAndName, {encoding: 'UTF-8'});
    return fileData;
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B04. Read contents of a folder
//
//>Supply a path to a folder as a string and UGUI will return an
// array with each file and folder as an object. Each item
// returned will have a "name" and "isFolder" property to tell
// if it's a file or a folder, and with the exception of some
// system files, they should all have a file size as well.
//
//>     var markupContents = ugui.helpers.readAFolder('_markup');
//
//>You can access the content like so:
//
//>     markupContents[0].name;     // returns string
//     markupContents[0].size;     // retunrs number
//     markupContents[0].isFolder; // returns boolean
//
//>You can also use a callback:
//
//>     ugui.helpers.readAFolder('_markup', function (contents) {
//         console.log(contents)
//     })

//
function readAFolder (filePath, callback) {
    //Validate that required argument is passed
    if (!filePath) {
        console.info(º + 'Supply a path to the file you want to read as ' +
            'an argument to this function.', consoleNormal);
        return;
    }
    //Validate types
    if (typeof(filePath) !== 'string') {
        console.info(º + 'File path must be passed as a string.', consoleNormal);
        return;
    } else if (callback && typeof(callback) !== 'function') {
        console.info(º + 'Callback must be passed as a function.', consoleNormal);
        return;
    }

    //fs.readdir only accepts unix style folder paths
    if (platform == 'win32') {
        filePath = filePath.replace('\\', '/');
    }

    //Output an error if we can't access the file
    fs.readdir(filePath, function (err) {
        //If there were problems reading the contents of a folder, stop and report them
        if (err) {
            console.info(º + 'Unable to read contents of the folder:', consoleNormal);
            console.warn(º + err.message, consoleError);
            return;
        }
    });

    //Create an object with an array in it
    var contents = [];
    //Store the contents of the passed in directory as an array
    var contentsList = fs.readdirSync(filePath);

    contentsList.forEach(function (file) {
        var stats = fs.lstatSync(filePath + correctSlash + file);

        //Check if it's a folder
        if (stats.isDirectory()) {
            contents.push({
                'name': file,
                'isFolder': true,
                'size': 0
            });
        //Check if it has a file size
        } else if (file !== 'undefined') {
            contents.push({
                'name': file,
                'isFolder': false,
                'size': stats.size
            });
        //Catch-all
        } else {
            contents.push({
                'name': file,
                'isFolder': false
            });
        }
    });

    //If a callback was passed in, run it
    if (callback) {
        callback(contents);
    //Otherwise just return the contents of the folder
    } else {
        return contents;
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B05. Write to file
//
//>This will override the contents of a file you pass in with
// the data you supply. If the file you point to doesn't exist,
// it will be created with your supplied data.
//
//>     ugui.helpers.writeToFile('C:/folder/new_file.htm', 'Text.');

//
function writeToFile (filePathAndName, data, callback) {
    //Validate that required arguments are passed and are the correct types
    if (!filePathAndName || typeof(filePathAndName) !== 'string') {
        console.info(º + 'Supply a path to the file you want to create or replace the ' +
            'contents of as the first argument to this function.', consoleNormal);
        console.info(º + 'File path and name must be passed as a string.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.writeToFile("C:/folder/file.htm", "Your data.");', consoleCode);
        return;
    } else if (!data) {
        console.info(º + 'You must pass in the data to be stored as the second argument ' +
            'to this function.', consoleNormal);
        return;
    } else if (typeof(data) !== 'string') {
        console.info(º + 'The data to be stored must be passed as a string.', consoleNormal);
        return;
    } else if (callback && typeof(callback) !== 'function') {
        console.info(º + 'Your callback must be passed as a function.', consoleNormal);
        return;
    }

    //Write to the file the user passed in
    fs.writeFile(filePathAndName, data, function (err) {
        //If there was a problem writing to the file
        if (err) {
            console.info(º + 'There was an error attempting to save your data.', consoleNormal);
            console.warn(º + err.message, consoleError);
            return;
        //If the file was updated and the user passed in a callback function, run it
        } else if (callback) {
            callback();
        }
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B06. Create a folder
//
//>This will create a new folder in the location you pass in.
// You cannot create a new folder with a folder in it. So if
// `C:/Taco` doesn't exist then the following wouldn't work:
//
//>     ugui.helpers.createAFolder('C:/Taco/Cheese');
//
//>You'd need to create the 'Taco' folder first, then the
// 'Cheese' folder, like so:
//
//>     ugui.helpers.createAFolder('C:/Taco', function () {
//         ugui.helpers.createAFolder('C:/Taco/Cheese');
//     });
//
//>In this example we are using a callback to create a
// subfolder. This ensures that the 'Taco' folder will exist
// before we attempt to create the 'Cheese' folder.

//
function createAFolder (filePath, callback) {
    //Validate that required argument is passed and is the correct types
    if (!filePath || typeof(filePath) !== 'string') {
        console.info(º + 'Supply a path to where you want your folder as the first ' +
            'argument to this function.', consoleNormal);
        console.info(º + 'Folder path must be passed as a string.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.createAFolder("C:/folder/new_folder");', consoleCode);
        return;
    //If a callback was passed in and it isn't a function
    } else if (callback && typeof(callback) !== 'function') {
        console.info(º + 'Your callback must be passed as a function.', consoleNormal);
        return;
    }

    //Create the folder in the supplied location
    fs.mkdir(filePath, function (err) {
        //If there was a problem creating the folder
        if (err) {
            console.info(º + 'There was an error attempting to create the folder.', consoleNormal);
            console.warn(º + err.message, consoleError);
            return;
        //If the folder was created and the user passed in a callback function, run it now
        } else if (callback) {
            callback();
        }
    });
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B07. Delete a file
//
//>Though UGUI doesn't currently use this functionality anywhere
// within itself, we thought it would be nice to offer a quick
// and easy way of deleting files.
//
//>     ugui.helpers.deleteAFile('C:/folder/delete_me.htm');

//
function deleteAFile (filePathAndName, callback) {
    //Validate that required argument is passed and is the correct types
    if (!filePathAndName || typeof(filePathAndName) !== 'string') {
        console.info(º + 'Supply a path to the file you want to delete as ' +
            'the first argument to this function.', consoleNormal);
        console.info(º + 'File path must be passed as a string.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.deleteAFile("C:/folder/delete_me.txt");', consoleCode);
        return;
    //If a callback was passed in and it isn't a function
    } else if (callback && typeof(callback) !== 'function') {
        console.info(º + 'Your callback must be passed as a function.', consoleNormal);
        return;
    }

    //Delete the selected file
    fs.unlink(filePathAndName, function (err) {
        //If there was a problem deleting the file
        if (err) {
            console.info(º + 'There was an error attempting to delete the file.', consoleNormal);
            console.warn(º + err.message, consoleError);
            return;
        //If the file deleted and the user passed in a callback function, run it now
        } else if (callback) {
            callback();
        }
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B08. Delete a folder
//
//>Though UGUI doesn't currently use this functionality anywhere
// within itself, we thought it would be nice to offer a quick
// and easy way to delete folders.
//
//>     ugui.helpers.deleteAFolder('C:/path/to/folder');
//
//>**NOTE:** This will not delete a folder unless it is empty.

//
function deleteAFolder (filePath, callback) {
    //Validate that required argument is passed and is the correct types
    if (!filePath || typeof(filePath) !== 'string') {
        console.info(º + 'Supply a path to the folder you want to delete as ' +
            'the first argument to this function.', consoleNormal);
        console.info(º + 'Folder path must be passed as a string.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.deleteAFolder("C:/folder/delete_me");', consoleCode);
        return;
    //If a callback was passed in and it isn't a function
    } else if (callback && typeof(callback) !== 'function') {
        console.info(º + 'Your callback must be passed as a function.', consoleNormal);
        return;
    }

    //Delete the selected folder
    fs.rmdir(filePath, function (err) {
        //If there was a problem deleting the folder
        if (err) {
            console.info(º + 'There was an error attempting to delete the folder.', consoleNormal);
            console.warn(º + err.message, consoleError);
            return;
        //If the folder deleted and the user passed in a callback function, run it now
        } else if (callback) {
            callback();
        }
    });
}





//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B09. Get a file's size
//
//>Though UGUI doesn't currently use this functionality anywhere
// within itself, we thought it would be nice to offer a quick
// and easy way to get the file size for a file.
//
//>This will return an object containing the size stored as
// bytes, kilobytes, and megabytes. You can also pass in a
// callback that takes the file size object as an argument.
//
//>     ugui.helpers.getFileSize('C:/folder/pizza.jpg');
//     ugui.helpers.getFileSize('C:/folder/pizza.jpg').bytes;
//     ugui.helpers.getFileSize('C:/folder/pizza.jpg').kilobytes;
//     ugui.helpers.getFileSize('C:/folder/pizza.jpg').megabytes;
//     ugui.helpers.getFileSize('C:/folder/pizza.jpg', function (fileSize,err) {
//         if (err) {
//             $('body').prepend(
//               '<div class="alert alert-danger alert-dismissible" role="alert">' +
//                 '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
//                     '<span aria-hidden="true">&times;</span>' +
//                 '</button>' +
//                 '<h4>Error Accessing File</h4>' +
//                 '<p>There was an error when trying to get the file size of your file.</p>' +
//               '</div>'
//             );
//         } else {
//             $('#output').html('Input file is ' + fileSize.kilobytes + 'KB');
//         }
//     });

//
function getFileSize (filePath, callback) {
    //Validate that required argument is passed and is the correct types
    if (!filePath || typeof(filePath) !== 'string') {
        console.info(º + 'Supply a path to the file you want the size of as ' +
            'the first argument to this function.', consoleNormal);
        console.info(º + 'File path must be passed as a string.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.getFileSize("C:/folder/pizza.jpg");', consoleCode);
        return;
    //If a callback was passed in and it isn't a function
    } else if (callback && typeof(callback) !== 'function') {
        console.info(º + 'Your callback must be passed as a function.', consoleNormal);
        return;
    }

    //Set up the info message for both possibilities below
    var infoMessage = 'There was an error attempting to retrieve file size.';
    //Declare the fileSize object (to be set later)
    var fileSize = {};

    //If a callback was passed in
    if (callback) {

        //Get the metadata for the file
        fs.stat(filePath, function (err, stats) {
            //If there was a problem getting the file's metadata
            if (err) {
                //output an error to the console, but keep running
                console.info(º + infoMessage, consoleNormal);
                console.warn(º + err.message, consoleError);
            //If there wasn't an error
            } else {
                //Create an object with common file size conversions
                fileSize = {
                    'bytes': stats.size,
                    'kilobytes': stats.size / 1024.0,
                    'megabytes': stats.size / 1048576.0
                };
            }
            //Run the callback with the filesizes if it worked, or an error if it didn't
            callback(fileSize, err);
            return;
        });
    //If a callback wasn't passed in
    } else {
        //Check if we can access the file
        fs.stat(filePath, function (err) {
            //If there was a problem getting the file's metadata
            if (err) {
                //console log an error and quit
                console.info(º + infoMessage, consoleNormal);
                console.warn(º + err.message, consoleError);
                return;
            }
        });

        //Get all metadata from the file
        var stats = fs.statSync(filePath);

        //Create an object with common file size conversions
        fileSize = {
            'bytes': stats.size,
            'kilobytes': stats.size / 1024.0,
            'megabytes': stats.size / 1048576.0
        };

        //Return the fileSize object
        return fileSize;
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B10. Set zoom percent
//
//>Since setting the zoom level is a common and expected task of
// browsers, and it isn't very intuitive or easy in NW.js, we
// provide a simple helper function.
//
//>     ugui.helpers.setZoomPercent(100); //default size
//     ugui.helpers.setZoomPercent(200); //double default size
//     ugui.helpers.setZoomPercent(50);  //half of default size
//
//>If you'd like to display the newly set zoom level percent on
// the page, you can pass in `true` as the second argument.
//
//>     ugui.helpers.setZoomPercent(110, true);

//
function setZoomPercent (percent, visible) {
    //Validate that required argument is passed and is the correct types
    if (percent && typeof(percent) !== 'number') {
        console.info(º + 'You must pass in a positive interger to represent' +
            'the zoom level percent.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.setZoomPercent(200); //200% of default size', consoleCode);
        console.info(º + 'Or leave it blank to reset back to 100% (default size)', consoleNormal);
        return;
    } else if (visible && typeof(visible) !== 'boolean') {
        console.info(º + 'You must pass in true or false to set the visibility' +
            'of the zoom level percent on the page.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.setZoomPercent(110, true);', consoleCode);
        return;
    }

    //Set the zoom percent to the number that was passed in or default to 100%
    var zoomPercent = percent || 100;
    var displayPercentOnPage = visible || false;

    //Allow access to the window settings
    var win = require('nw.gui').Window.get();

    //zoom level expects 0 for default (100%) and ~2.224 for 200%
    //Negative numbers reduce the size. This isn't very intuitive
    //though so we do some math to allow easier numbers.
    win.zoomLevel = Math.log(zoomPercent / 100) / Math.log(1.2);

    //Define a function to hide the Zoom Level percent that appears on screen
    function hideZoomLevel () {
        $('.ugui-zoom-level').remove();
    }

    //If `true` was passed in
    if (displayPercentOnPage) {
        //Create a div on the page to display the current zoom percent
        $('body').append('<div class="ugui-zoom-level">' + zoomPercent + '%</div>');
        //After one second remove it from the page
        setTimeout(hideZoomLevel, 1000);
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### B11. Open Folder
//
//>This will oepn the passed in folder in Explorer, Nautilus, or
// Finder depending on your OS.
//
//>     ugui.helpers.openFolder('C:\path\to\folder');
//     ugui.helpers.openFolder('..\folder');
//     ugui.helpers.openFolder('/path/to/folder');

//
function openFolder (folderPath) {
    //Validate that required argument is passed and is the correct types
    if (!folderPath || typeof(folderPath) !== 'string') {
        console.info(º + 'Supply a path to the folder you want to open as ' +
            'the first argument to this function.', consoleNormal);
        console.info(º + 'Folder path must be passed as a string.', consoleNormal);
        console.info(º + 'Example:', consoleBold);
        console.info(º + 'ugui.helpers.open("C:\\folder");', consoleCode);
        return;
    }

    var os = process.platform;
    var winPath = folderPath.replace('/', '\\');
    var nonWinPath = folderPath.replace('\\', '/');

    //If you're on Windows
    if (os == 'win32') {
        //Open Explorer
        runcmd('explorer ' + winPath);
    //If on OSX
    } else if (os == 'darwin') {
        //Open Finder
        runcmd('open ' + nonWinPath);
    //If on Ubuntu
    } else {
        //Open Nautilus
        runcmd('xdg-open ' + nonWinPath);
    }
}














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## C00. CLI Command Processing
//
//This section is the primary purpose, and the heart of UGUI.
//It's what takes the `<cmd>`, `<arg>`, and `<def>` stuff,
//matches it with the `data-argName` stuff, and ultimately
//outputs it to the command-line.
//
//It's also responsible for building the UGUI Arg object,
//which is used for other things, like saving settings.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C01. Clicking Submit
//
//>What happens when you click the submit button.
//
//>When the button is pressed, prevent it from submitting the
// form like it normally would in a browser. Detect which form
// the submit button is in and what executable it corresponds
// to. Remove quotes from all fields. Build the command line
// array based on UGUI Args Object and turn it into a string.
//
//>Detect if text from the command line is meant to be printed
// on the page. Then run the command.

//When you click the submit button.
$('.sendCmdArgs').click(function (event) {

    //Prevent the form from sending like a normal website.
    event.preventDefault();

    //Get the correct executable to use based on the form you clicked on
    var thisExecutable = $(this).closest('form').attr('id');

    //Remove all single/double quotes from any text fields
    removeTypedQuotes();

    //Build the command line array with the executable and all commands
    var builtCommandArray = buildCommandArray(thisExecutable);

    //Convert the array to a string that can be ran in a command line using the runcmd function
    var builtCommandString = convertCommandArraytoString(builtCommandArray);

    //Check if the form has an element with a class of `returnedCmdText`
    if ($('#' + thisExecutable + ' .returnedCmdText').length > 0) {
        //If so, run a command and put its returned text on the page
        runcmd(builtCommandString, function (data) {
            $('#' + thisExecutable + ' .returnedCmdText').html(data);
        });
    } else {
        //Run the command!
        runcmd(builtCommandString);
    }
});






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C02. Building the Command Array
//
//>What happens when you click the submit button or when the
// UGUI Developer Toolbar's "CMD Output" section is updated to
// preview the outputted command that would be sent to the
// command line/terminal.

//
function buildCommandArray (thisExecutable) {
    //Validate types
    if (thisExecutable !== undefined && typeof(thisExecutable) !== 'string') {
        console.info(º + 'Executable must be passed as a string.', consoleNormal);
        return;
    }

    //If no executable was passed in, just use the first one in `<cmd>`'s
    thisExecutable = thisExecutable || executable[0];

    //Set up commands to be sent to command line
    var cmds = [ thisExecutable ];

    //Fill out `window.ugui.args` object
    buildUGUIArgObject();

    //Process all definitions and place them in `window.ugui.args`
    patternMatchingDefinitionEngine();

    //Setting up arrays
    var cmdArgsText = [];
    //Loop through all the `<args>` in the `<cmd>` with the selected executable
    for (index = 0; index < $('cmd[executable=' + thisExecutable + '] arg').length; index++) {
        //Set the current `<arg>`
        var currentArg = $('cmd[executable=' + thisExecutable + '] arg')[index];
        //Put the `<arg>` text into an array
        cmdArgsText.push($(currentArg).text());
    }

    //Loop through all phrases and add processed versions to output array
    for (index = 0; index < cmdArgsText.length; index++) {
        //`cmdArgsText[index]` is `--quality ((meow)) to ((oink.min))`
        cmds.push(parseArgument(cmdArgsText[index]));
    }

    //After all the processing is done and the array is built, return it
    return cmds;
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C03. Build UGUI Arg Object
//
//>This grabs all the data about the elements on the page that
// have a `data-argName` and puts that information on the window
// object, located here: `window.ugui.args`

//
function buildUGUIArgObject () {
    //Reset the UGUI Args Object to remove any stragglers
    window.ugui.args = {};

    //Make an array containing every element on the page with an attribute of `data-argName`
    var cmdArgs = $('*[data-argName]');

    //Cycle through all elements with a `data-argName`
    for (index = 0; index < cmdArgs.length; index++) {

        //Get `bob` from `<input data-argName="bob" value="--kitten" />`
        var argName = $(cmdArgs[index]).attr('data-argName');

        //Get `--carrot` from `<input type="radio" data-argName="vegCarrot" value="--carrot" />`
        var argValue = $(cmdArgs[index]).val();

        //Declare variable now to be defined below
        var argType = '';
        //Get `input` from `<input data-argName="bob" type="checkbox" />`
        var argTag = $(cmdArgs[index]).prop('tagName').toLowerCase();

        //See if the current item is a range slider
        if ($(cmdArgs[index]).hasClass('slider')) {
            //Manually set the type to `range` for range slider elements
            argType = 'range';
        //See if the element is an item in one of Bootstrap's fake dropdowns
        } else if ($(cmdArgs[index]).parent().parent().hasClass('dropdown-menu')) {
            //Manually set the type to `dropdown`
            argType = 'dropdown';
        //Check to see if input is a folder browser
        } else if ($(cmdArgs[index]).attr('nwdirectory')) {
            //Manually set the type if it's a folder browser
            argType = 'folder';
        //If a select tag was used (traditional dropdown)
        } else if (argTag == 'select') {
            //Manually set the type to match the tag
            argType = 'select';
        //Unlike input tags, textareas don't have a type attribute
        } else if (argTag === 'textarea') {
            //Manually set the type to match the tag
            argType = 'textarea';
        } else {
            //Catch-all. Get `checkbox` from `<input data-argName="bob" type="checkbox" />`
            argType = $(cmdArgs[index]).attr('type');
        }

        //Basic info put on every object
        window.ugui.args[argName] = {
            'value': argValue,
            'htmltag': argTag,
            'htmltype': argType
        };

        //Special info just for `<input type="file" nwdirectory="nwdirectory">`
        if (argType === 'folder') {
            setInputFolderPathName(cmdArgs[index], argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //Special info just for `<input type="file">`
        if (argType === 'file') {
            setInputFilePathNameExt(cmdArgs[index], argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //Special info just for `<input type="color">`
        if (argType === 'color') {
            colorProcessor(argValue, argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //For checkboxes and radio dials, add special info
        if (argType === 'checkbox' || argType === 'radio' || argType === 'dropdown') {
            if ($(cmdArgs[index]).prop('checked')) {
                window.ugui.args[argName].htmlticked = true;
            } else {
                window.ugui.args[argName].htmlticked = false;
            }
        }

    }

}

//Run once on page load
buildUGUIArgObject();






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C04. Find Key Value
//
//>This is a general purpose function that allows retrieving
// information from an object. Here is an example object and
// how `findKeyValue()` works to return data from it:
//
//>     var a = {
//         'b': 'dog',
//         'c': {
//             'd': 'cat',
//             'e': 'bat'
//         }
//     };
//     var ab  = ['b'];
//     var acd = ['c','d'];
//
//>     console.log(findKeyValue(a,ab) );  //dog
//     console.log(findKeyValue(a,acd) ); //cat

//
function findKeyValue (obj, arr) {
    // Validate that both required arguments are passed
    if (!obj || !arr) {
        console.info(º + 'You need to supply an object and an array of ' +
            'strings to drill down within the object.', consoleNormal);
        return;
    }
    // Validate types
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        console.info(º + 'First argument must be passed as an object.', consoleNormal);
        return;
    } else if (Object.prototype.toString.call(arr) !== '[object Array]') {
        console.info(º + 'Second argument must be passed as strings in an array.', consoleNormal);
        return;
    }
    // Validate that all items of the array are strings
    for (i = 0; i < arr.length; i++) {
        if (typeof(arr[i]) !== 'string') {
            console.info(º + 'Second argument must be passed as strings in an array.', consoleNormal);
            return;
        }
    }

    /* console.log(obj, arr); */
    for (var i = 0; i < arr.length; i++) {
        obj = obj[arr[i]];
    }
    //For stuff like `((moo))`, assume the user means `((moo.value))`
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        obj = obj.value;
    }
    /* console.log(obj); */
    return obj;
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C05. Parse Argument
//
//>This takes the argument from the `<cmd><arg>`, finds all
// the `((keywords))` and replaces them with the information on
// the UGUI Args Object found here: `window.ugui.args`

//
function parseArgument (argumentText) {
    //Validate that required argument is passed
    if (!argumentText) {
        console.info(º + 'This processes strings of text that contain ' +
            '((keywords)) in them from the <cmd> tags.', consoleNormal);
        return;
    }
    //Validate types
    if (typeof(argumentText) !== 'string') {
        console.info(º + 'Argument text must be passed as a string.', consoleNormal);
        return;
    }

    //`argumentText = 'and ((meow)), with ((oink)) too. '`
    var regexToMatch = /\(\((.*?)\)\)/;

    //Keep rerunning this until all `((keywords))` in `argumentText` are replaced with their actual values
    while (regexToMatch.test(argumentText)) {

        //`match = ['((meow))','meow']`
        var match = regexToMatch.exec(argumentText);
        var uguiArgObj = window.ugui.args;

        var regExMatch = RegExp('\\(\\(' + match[1] + '\\)\\)');
        //`matched = uguiArgObj.meow`
        var matched = uguiArgObj[match[1]];

        if (matched === undefined) {
            var matchName = match[1].split('.')[0];
            matched = uguiArgObj[matchName];
        }

        /* console.log('-----------------'); */
        /* console.log('value: ', matched.value ); */

        //Skip all unchecked checkboxes and unchecked radio dials.
        //Skip everything without a value
        if (
            (matched.htmltype === 'checkbox' && matched.htmlticked === false) ||
            (matched.htmltype === 'radio' && matched.htmlticked === false) ||
            (matched.htmltype === 'dropdown' && matched.htmlticked === false) ||
            (typeof(matched.value) === 'undefined') ||
            (matched.value === '')
           ) {
            //Replace the `--quality ((meow))` with an empty string
            argumentText = '';
            return argumentText;
        //Run all the non-checkbox/radio/file elements,
        //all checked checkboxes and checked radio dials
        } else if (
            (matched.htmltype !== 'checkbox' && matched.htmltype !== 'radio') ||
            (matched.htmltype === 'checkbox' && matched.htmlticked === true) ||
            (matched.htmltype === 'radio' && matched.htmlticked === true)
           ) {
            //Find the correct value from the UGUI Args Object
            var foundKeyValue = findKeyValue(uguiArgObj, match[1].split('.'));
            //Replace the '--quality ((meow))' with '--quality 9'
            argumentText = argumentText.replace(regExMatch, foundKeyValue);
        //And whatever's left
        } else {
            //Replace the '--quality ((meow))' with ''
            argumentText = '';
        }

    /* console.log(argumentText); */

    }

    return argumentText;
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C06. Process All CMD Definitions
//
//>This loops through all `<def>`'s and processes the value of
// them to create the correct key value pairs on the UGUI Args
// Object.

//
function patternMatchingDefinitionEngine () {
    //A regular expression that matches `((x))` and captures `x`
    var re = /\(\((.*?)\)\)/gi;

    $('def').each(function (index, value) { // eslint-disable-line no-unused-vars
        //Assign 'value' to `def`
        //`def = <def name="quality">((min)),((max))</def>`
        var def = value;

        //Get the actual definition from the `<def>`
        //`definition = '((min)),((max))'`
        var definition = $(def).html();

        //Get the argument associated with this `<def>`
        //`arg = ugui.args.quality`
        var arg = ugui.args[$(def).attr('name')];

        var match;
        var currentIndex = 0;
        var separators = [];
        var args = [];
        //Loop through the definition grabbing all the separators and arguments
        while (true) {
            //Assign the RegEx result to match and check to see if there is a match
            if ((match = re.exec(definition)) !== null) {
                //Grab any text separating the values and push it to a collector array
                separators.push(definition.slice(currentIndex, match.index));
                //Update the slice start index for the next iteration
                currentIndex = re.lastIndex;

                //Add the argument from the definition to the global UGUI object
                arg[match[1]] = '';

                //Add the argument to the `args` array for value assignment in next loop
                args.push(match[1]);
            //If there are no more arguments:
            } else {
                //Put the last part of the definition into the separator array
                separators.push(definition.slice(currentIndex));
                //End the loop
                break;
            }
        }

        //Get the value of the associated argument
        //`argValue = '0,75'`
        var argValue = arg.value;

        //`splitIndex` is used to keep track of where we are in the value
        var splitIndex = 0;

        //Loop through the arguments defined by this `<def>`, parse the value using the separators, and assign the correct value
        for (var i = 0; i < args.length; i++) {
            //The separators around the current argument  
            //`firstSeparator = ''`  
            //`secondSeparator = ','`
            var firstSeparator = separators[i];
            var secondSeparator = separators[i + 1];

            //The first if catches cases where the dev has unnecessarily used a `<def>`
            if (firstSeparator == '' && secondSeparator == '') {
                arg[args[i]] = argValue;
            //This catches if there is no text before the first value to map
            } else if (firstSeparator == '') {
                arg[args[i]] = argValue.slice(splitIndex, argValue.indexOf(secondSeparator));
                splitIndex = argValue.indexOf(secondSeparator);
            //This catches if there is no text after the last value to map
            } else if (secondSeparator == '') {
                arg[args[i]] = argValue.slice((argValue.indexOf(firstSeparator, splitIndex) + firstSeparator.length));
            //This catches in all other cases
            } else {
                arg[args[i]] = argValue.slice(
                    (argValue.indexOf(firstSeparator, splitIndex) + firstSeparator.length),
                    argValue.indexOf(secondSeparator, (splitIndex + firstSeparator.length))
                );
                splitIndex = argValue.indexOf(secondSeparator, (splitIndex + firstSeparator.length));
            }
        }
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C07. Convert Command Array to string
//
//>Take the array of executable and commands, remove empty
// arguments and put everything into a string to be sent out
// to the command line.

//
function convertCommandArraytoString (cmdArray) {
    //Validate that the required argument is passed
    if (!cmdArray) {
        console.info(º + 'Accepts an array of executable and commands, ' +
            'removes empty arguments and puts everything into a string ' +
            'ready to be sent out to the command line.', consoleNormal);
        return;
    }
    //Validate types
    if (Object.prototype.toString.call(cmdArray) !== '[object Array]') {
        console.info(º + 'Command array must be passed as strings in an array.', consoleNormal);
        return;
    }
    //Validate that all items of the array are strings
    for (index = 0; index < cmdArray.length; index++) {
        if (typeof(cmdArray[index]) !== 'string') {
            console.info(º + 'Arguments must be passed as strings in an array.', consoleNormal);
            return;
        }
    }

    //Create and empty variable
    var cmdString = '';

    //     cmdArray = ['cli_filename', '', '', '-nyan', '--speed 1mph', '', '', '-pear', '--potato', '', '', '', '-m "Text"', '"C:\kittens.new.png"']
    for (index = 0; index < cmdArray.length; index++) {
        //Make sure the executable isn't preceded with a space
        if (index === 0) {
            cmdString = cmdArray[0];
        //Add in the rest of the arguments, skipping blank ones
        } else if (cmdArray[index]) {
            cmdString = cmdString + ' ' + cmdArray[index];
        }
    }

    //Return the command string that will be ran
    return cmdString;
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C08. Set input file path, file name, and extension
//
//>This processes elements with a `data-argName` that are
// `<input type="file">`. It creates special properties for the
// element and places them on the UGUI Args Object found here:
// `window.ugui.args`

//
function setInputFilePathNameExt (currentElement, argName) {
    //Validate that both required arguments are passed
    if (!currentElement || !argName) {
        console.info(º + 'You must pass in the element as an object and ' +
            'its argName as a string.', consoleNormal);
        return;
    }
    //Validate types
    if (typeof(currentElement) !== 'object') {
        console.info(º + 'Element must be passed as a jQuery object.', consoleNormal);
        return;
    } else if (typeof(argName) !== 'string') {
        console.info(º + 'The argName must be passed as a string.', consoleNormal);
        return;
    }

    //Create a variable that contains all the file information supplied by Webkit
    var fileAttributes = currentElement.files[0];

    //Before continuing, verify that the user has selected a file
    if (fileAttributes) {

        //Create filename and file path variables to be used below
        var filename = '';
        var filepath = '';

        // Either `C:\users\bob\desktop\cows.new.png` or `/home/bob/desktop/cows.new.png`
        var fullFilepath = fileAttributes.path;

        //`cows.new.png`
        filename = fileAttributes.name;

        //If you're on Windows then folders in file paths are separated with `\`, otherwise OS's use `/`
        if (platform == 'win32') {
            //Get the index of the final backslash so we can split the name from the path
            var lastBackslash = fullFilepath.lastIndexOf('\\');
            //`C:\users\bob\desktop\`
            filepath = fullFilepath.substring(0, lastBackslash + 1);
        } else {
            //Get the index of the final backslash so we can split the name from the path
            var lastSlash = fullFilepath.lastIndexOf('/');
            //`/home/bob/desktop/`
            filepath = fullFilepath.substring(0, lastSlash + 1);
        }

        //Split `'cows.new.png'` into `['cows', 'new', 'png']`
        var filenameSplit = filename.split('.');
        //Remove last item in array, `['cows', 'new']`
        filenameSplit.pop();
        //Combine them back together as a string putting the `.` back in, `'cows.new'`
        var filenameNoExt = filenameSplit.join('.');

        //Create the args object parameters on the UGUI Args Object
        window.ugui.args[argName] = {
            'fullpath': fileAttributes.path,
            'path': filepath,
            'name': filenameNoExt,
            'nameExt': filename,
            'ext': filename.split('.').pop(),
            'lastModified': fileAttributes.lastModified,
            'lastModifiedDate': fileAttributes.lastModifiedDate,
            'size': fileAttributes.size,
            'type': fileAttributes.type,
            'value': fileAttributes.path,
            'webkitRelativePath': fileAttributes.webkitRelativePath
        };

    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C09. Set input folder path and folder name
//
//>This processes elements with a `data-argName` that are
// `<input type="file" nwdirectory="nwdirectory">`. It creates
// special properties for the element and places them on the
// UGUI Args Object found here: `window.ugui.args`

//
function setInputFolderPathName (currentElement, argName) {
    //Validate that both required arguments are passed
    if (!currentElement || !argName) {
        console.info(º + 'You must pass in the element as an object and ' +
            'its argName as a string.', consoleNormal);
        return;
    }
    //Validate types
    if (typeof(currentElement) !== 'object') {
        console.info(º + 'Element must be passed as a jQuery object.', consoleNormal);
        return;
    } else if (typeof(argName) !== 'string') {
        console.info(º + 'The argName must be passed as a string.', consoleNormal);
        return;
    }

    //Create a variable that contains all the file information supplied by Webkit
    var fileAttributes = currentElement.files[0];

    //Before continuing, verify that the user has selected a file
    if (fileAttributes) {

        //Create folder name and file path variables to be used below
        var folderName = '';
        var filePath = '';

        //Either `C:\users\bob\desktop\cows.new.png` or `/home/bob/desktop/cows.new.png`  
        //Use the first one, unless you are loading settings and it doesn't exist
        var fullFilePath = fileAttributes.fullpath || fileAttributes.path;

        //If you're on Windows then folders in file paths are separated with `\`, otherwise OS's use `/`
        if (platform == 'win32') {
            //Get the index of the final backslash so we can split the name from the path
            var lastBackslash = fullFilePath.lastIndexOf('\\');
            //`C:\users\bob\desktop\`
            filePath = fullFilePath.substring(0, lastBackslash + 1);
            folderName = fullFilePath.split('\\').pop();
        } else {
            //Get the index of the final backslash so we can split the name from the path
            var lastSlash = fullFilePath.lastIndexOf('/');
            //`/home/bob/desktop/`
            filePath = fullFilePath.substring(0, lastSlash + 1);
            folderName = fullFilePath.split('/').pop();
        }

        //Create the args object parameters on the UGUI Args Object
        window.ugui.args[argName] = {
            'contents': readAFolder(fullFilePath)[0],
            'contentsList': readAFolder(fullFilePath)[1],
            'fullpath': fullFilePath,
            'path': filePath,
            'folderName': fileAttributes.name || folderName,
            'lastModified': fileAttributes.lastModified,
            'lastModifiedDate': fileAttributes.lastModifiedDate,
            'value': fileAttributes.path,
            'webkitRelativePath': fileAttributes.webkitRelativePath
        };

    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C10. Prevent user from entering quotes in forms
//
//>In all input text fields and textareas, remove both single
// and double quotes as they are typed, on page load, and when
// the form is submitted.

//Remove all quotes on every text field whenever typing or leaving the field
$(textFields).keyup(removeTypedQuotes);
$(textFields).blur(removeTypedQuotes);

function removeTypedQuotes () {
    //Loop through all text fields on the page
    for (index = 0; index < textFields.length; index++) {
        //User entered text of current text field
        var textFieldValue = $(textFields[index]).val();
        //If the current text field has a double or single quote in it
        if (textFieldValue.indexOf('"') != -1 || textFieldValue.indexOf('\'') != -1) {
            //Remove quotes in current text field
            $(textFields[index]).val($(textFields[index]).val().replace(/['"]/g, ''));
        }
    }
}

removeTypedQuotes();







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### C11. Color Processor
//
//>Process input elements with a type of color to generate
// RGB, Hex, and Decimal values, then place them on the
// `ugui.args.{data-argName}` object.

//
function colorProcessor (inputColor, argName) {
    //Validate that both required arguments are passed
    if (!inputColor || !argName) {
        console.info(º + 'You must pass in your Hex color (#FF0000) as a ' +
            'string accompanied by it\'s argName.', consoleNormal);
        return;
    }
    //Validate types
    if (typeof(inputColor) !== 'string') {
        console.info(º + 'Hex color must be passed as a string.', consoleNormal);
        return;
    } else if (inputColor[0] !== '#') {
        console.info(º + 'Hex color must begin with #.', consoleNormal);
        return;
    } else if (typeof(argName) !== 'string') {
        console.info(º + 'argName must be passed as a string.', consoleNormal);
        return;
    }

    //Setup variables
    var R = ''; var r = '';
    var G = ''; var g = '';
    var B = ''; var b = '';
    var rgb = inputColor.split('');
    var sansOctothorpe = rgb[1] + rgb[2] + rgb[3] + rgb[4] + rgb[5] + rgb[6];

    for (var i = 1; i < rgb.length; i++) {
        var rgbi = rgb[i];
        //Convert Hex to Dec
        if (rgbi == 'A' || rgbi == 'a') { rgbi = '10'; }
        if (rgbi == 'B' || rgbi == 'b') { rgbi = '11'; }
        if (rgbi == 'C' || rgbi == 'c') { rgbi = '12'; }
        if (rgbi == 'D' || rgbi == 'd') { rgbi = '13'; }
        if (rgbi == 'E' || rgbi == 'e') { rgbi = '14'; }
        if (rgbi == 'F' || rgbi == 'f') { rgbi = '15'; }

        //Set RrGgBb to decimal
        if (i === 1) { R = rgbi; } else
        if (i === 2) { r = rgbi; } else
        if (i === 3) { G = rgbi; } else
        if (i === 4) { g = rgbi; } else
        if (i === 5) { B = rgbi; } else
        if (i === 6) { b = rgbi; }
    }

    //As 0-255
    var Red   = (parseInt(R) * 16) + parseInt(r);
    var Green = (parseInt(G) * 16) + parseInt(g);
    var Blue  = (parseInt(B) * 16) + parseInt(b);

    //As 0-100%
    var RP = Math.floor((Red / 255) * 100);
    var GP = Math.floor((Green / 255) * 100);
    var BP = Math.floor((Blue / 255) * 100);

    var DecRrGgBb = R + ' ' + r + ' ' + G + ' ' + g + ' ' + B + ' ' + b;
    //Create the args object parameters on the UGUI Args Object
    window.ugui.args[argName] = {
        'rgb': 'rgb(' + Red + ',' + Green + ',' + Blue + ')',
        'decred': Red,
        'decgreen': Green,
        'decblue': Blue,
        'decRrGgBb': DecRrGgBb,
        'hexRrGgBb': sansOctothorpe,
        'percentRed': RP,
        'percentGreen': GP,
        'percentBlue': BP,
        'value': inputColor
    };
}














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## D00. UI Elements
//
//These are things specific to the stuff on the page. These may
//not be relevent to apps made using UGUI that do a lot of
//custom UI work.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### D01. Submit locked until required fulfilled
//
//>Gray out the submit button until all required elements are
// filled out. On every change, click, or keystroke, check all
// forms to verify that if any need unlocked or locked.

//
function unlockSubmit () {
    //Cycle through each executable
    for (index = 0; index < executable.length; index++) {
        //Get the current executable
        var currentExecutable = executable[index];
        //If a required element wasn't filled out in this form
        if ($('#' + currentExecutable).is(':invalid')) {
            //Disable/Lock the submit button
            $('#' + currentExecutable + ' .sendCmdArgs').prop('disabled', true);
        //If all required elements in a form have been fulfilled
        } else {
            //Enable/Unlock the submit button
            $('#' + currentExecutable + ' .sendCmdArgs').prop('disabled', false);
        }
    }

}

for (index = 0; index < argsForm.length; index++) {
    //When you click out of a form element
    $(argsForm[index]).keyup  (unlockSubmit);
    $(argsForm[index]).mouseup(unlockSubmit);
    $(argsForm[index]).change (unlockSubmit);
}

//On page load have this run once to unlock submit if nothing is required.
unlockSubmit();







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### D02. Replace HTML text with text from package.json
//
//>Some text on the page can be auto-filled from the content in
// the package.json. This replaces the text on the page.

//
$('.applicationName').html(appName);
$('.applicationTitle').html(appTitle);
$('.applicationDescription').html(appDescription);
getAboutModal();







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### D03. Update About modal
//
//>This pulls in information about the application from the
// package.json file and puts in in the "About" modal. It also
// pulls in UGUI's about info from the `_markdown` folder.

//
function getAboutModal () {
    $.get('_markup/ugui-about.htm', function (aboutMarkup) {
        //Put UGUI about info in about modal
        $('#aboutModal .modal-body').append(aboutMarkup);

        //Wait for the "UGUI about" info to be loaded before updating the "App about" section
        //Load application name, version number, and author from package.json
        $('.applicationName').html(appTitle);
        $('.versionApp').html(appVersion).prepend('V');
        $('.authorName').html(authorName);
        $('.versionUGUI').html(uguiVersion);
        $('#aboutModal .nwjsVersion').append(' (Version ' + process.versions['node-webkit'] + ')');
        $('#aboutModal .chromiumVersion').append(' (Version ' + process.versions['chromium'] + ')');
        $('#aboutModal .iojsVersion').append(' (Version ' + process.versions['node'] + ')');

        //After all content is loaded, detect all links that should open in the default browser
        openDefaultBrowser();

        //Remove modal, enable scrollbar
        function removeModal () {
            $('#aboutModal').slideUp('slow', function () {
                $('body').removeClass('no-overflow');
                //If the navigation is expanded, then close it after exiting the modal
                if (!$('.navbar-toggle').hasClass('collapsed')) {
                    $('.navbar-toggle').trigger('click');
                }
            });
        }

        //When clicking on background or X, remove modal
        $('#aboutModal').click(removeModal);
        //Allow you to click in the modal without triggering the `removeModal` function called when you click its parent element
        $('#aboutModal .modal-content').click(function (event) {
            event.stopPropagation();
        });
        $('#aboutModal .glyphicon-remove').click(removeModal);

    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### D04. Navigation bar functionality
//
//>Everything in this section controls the visibility and the
// functionality of the items in the top navigation bar.

//Clicking View > Command Line Output in the Nav Bar
$('.navbar a[href="#cmdoutput"]').click(function () {
    $('#uguiDevTools nav span[data-nav="uguiCommand"]').trigger('click');
});

//Clicking View > Console in the Nav Bar
$('.navbar a[href="#console"]').click(function () {
    require('nw.gui').Window.get().showDevTools();
});

//Clicking View > Fullscreen
$('.navbar a[href="#fullscreen"]').click(function () {
    require('nw.gui').Window.get().toggleFullscreen();
});

//Clicking "About" in the Nav Bar
$('.navbar a[href="#about"]').click(function () {

    //Get the current Window
    var win = require('nw.gui').Window.get();

    //Show the modal
    $('#aboutModal').fadeIn('slow');

    function setModalHeight () {
        if (win.height < 301) {
            $('.modal-header').addClass('shortScreen');
        } else {
            $('.modal-header').removeClass('shortScreen');
        }
        modalBodyHeight();
    }

    //Get the current height of the window and set the modal to 75% of that
    function modalBodyHeight () {
        $('#aboutModal .modal-body').css('max-height', (win.height * 0.5) + 'px');
    }

    //Make the header of the modal small when app is tiny
    setModalHeight();
    win.on('resize', setModalHeight);

    //Remove page scrollbar when modal displays
    $('body').addClass('no-overflow');

});

//Makes sure that the logo and app name in the nav bar are vertically centered
function centerNavLogo () {
    var navHeight = $('.navbar').height();
    $('.navbar-brand').css('line-height', navHeight + 'px');
    $('.navbar-brand').css('padding-top', '0px');
    $('.navbar-brand *').css('line-height', navHeight + 'px');
    $('#sidebar').css('margin-top', (navHeight - 1) + 'px');
}

//Run once on page load
centerNavLogo();

//When you click on the exit in the navigation, close this instance of NW.js
$('.navbar a[href="#exit"]').click(function () {
    require('nw.gui').Window.get().close(true);
});







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### D05. Launch links in default browser
//
//>Detects all links on the page with a class of `external-link`
// and sets them to open the link in the user's default browser
// instead of using NW.js as a browser which can cause issues.

//
function openDefaultBrowser () {

    //Load native UI library.
    var gui = require('nw.gui');

    $('.external-link').unbind('click');

    //Open URL with default browser.
    $('.external-link').click(function (event) {
        //Prevent the link from loading in NW.js
        event.preventDefault();
        //Get the `href` URL for the current link
        var url = $(this).attr('href');
        //Launch the user's default browser and load the URL for the link they clicked
        gui.Shell.openExternal(url);
    });
}
//Run once on page load
openDefaultBrowser();







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### D06. Check for updates
//
//>This is an advanced feature of UGUI useful to those
// maintaining their projects on GitHub and posting releases
// on their Repo's release page. This will check for the version
// number of the latest release and compare it to the version
// number in the `package.json`, then offer a link to the release
// page if there is a newer release.
//
//>You must supply a "Repository URL" in your `package.json` file
// and it must match the following pattern:
//
//`git://github.com/USERNAME/REPO.git`
//
//>And you must also publish releases on GitHub

//When the user clicks the button in the help menu, contact Github and check for updates
function checkForUpdates () {
    //git://github.com/USERNAME/REPO.git
    var repoURL = packageJSON.repository[0].url;
    //[ 'git:', '', 'github.com', 'USERNAME', 'REPO.git' ]
    var repoURLSplit = repoURL.split('/');
    var helpMessage = 'Visit UGUI.io/api to learn how to use the "Check for updates" feature.';

    //If the first or third items in the array match the pattern of a github repo
    if (repoURLSplit[0].toLowerCase() == 'git:' || repoURLSplit[2].toLowerCase() == 'github.com') {
        //Grab the Username from the Repo URL
        var username = repoURLSplit[3];
        //Get the Repo name from the Repo URL
        var repoName = repoURLSplit[4].split('.git')[0];
        //Build the URL for the API
        var updateURL = 'https://api.github.com/repos/' + username + '/' + repoName + '/releases';
    } else {
        console.info(º + 'Unable to check for updates because your Repository ' +
            'URL does not match expected pattern.', consoleNormal);
        console.info(º + helpMessage, consoleNormal);
        return;
    }

    //Hit the GitHub API to get the data for latest releases
    $.ajax({
        url: updateURL,
        error: function () {
            //Display a message in the About Modal informing the user they have the latest version
            $('#updateResults').html(
                '<p class="text-center">' +
                  '<strong>Unable to reach update server. Try again later.</strong>' +
                '</p>'
            );
            console.info(º + 'Unable to check for updates because GitHub cannot be reached ' +
                'or your Repository URL does not match expected pattern.', consoleError);
            console.info(º + helpMessage, consoleNormal);
            return;
        },
        success: function (data) {
            //0.2.5
            var remoteVersion = data[0].tag_name.split('v')[1];
            var localVersion = appVersion;
            //[ '0', '2', '5' ]
            var remoteVersionSplit = remoteVersion.split('.');
            var localVersionSplit = localVersion.split('.');
            var rvs = remoteVersionSplit;
            var lvs = localVersionSplit;
            //Check if the Major, Minor, or Patch have been updated on the remote
            if (
                 (rvs[0] > lvs[0]) ||
                 (rvs[0] == lvs[0] && rvs[1] > lvs[1]) ||
                 (rvs[0] == lvs[0] && rvs[1] == lvs[1] && rvs[2] > lvs[2])
               ) {
                //Display in the About Modal a link to the release notes for the newest version
                $('#updateResults').html(
                    '<p>' +
                      '<strong>Update found!</strong> ' +
                      '<a href="' + data[0].html_url + '" class="external-link">' +
                        'View latest release' +
                      '</a>.' +
                    '</p>'
                );
                //Make sure the link opens in the user's default browser
                ugui.helpers.openDefaultBrowser();
            //If there is not a new version of the app available
            } else {
                //Display a message in the About Modal informing the user they have the latest version
                $('#updateResults').html(
                    '<p class="text-center">' +
                      '<strong>You have the latest version of ' + appTitle + '.</strong>' +
                    '</p>'
                );
            }
        }
    });
}

//When the user clicks the "Check for updates" button in the about modal run the above function
$('#updateChecker').click(checkForUpdates);














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## E00. Warnings
//
//These are warnings that occur when UGUI detects you are doing
//something that could break its functionality. They are
//designed to be precautionary and informative. They only occur
//when in `dev` mode.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### E01. Warn if identical data-argNames
//
//>If the developer uses the same `data-argName` value for
// multiple elements, display a warning.

//
function warnIfDuplicateArgNames () {
    var duplicatesArray = {};
    var cmdArgs = '';
    var cmdArgsWithoutDuplicates = [];

    //Cycle through each executable
    for (index = 0; index < executable.length; index++) {
        //All elements with a `data-argName` in a form with a matching executable ID
        cmdArgs = '';
        cmdArgs = argsForm[index];
        duplicatesArray = {};

        //Loop through all form elements for this executable
        for (var subindex = 0; subindex < cmdArgs.length; subindex++) {
            //Put each element's `data-argName` and into an array
            duplicatesArray[cmdArgs[subindex].dataset.argname] = cmdArgs[subindex];
        }

        //Create a new array with duplicate `argName`s removed
        cmdArgsWithoutDuplicates = [];
        for (var key in duplicatesArray) {
            cmdArgsWithoutDuplicates.push(duplicatesArray[key]);
        }

        //If the new array had any duplicates removed display a warning.
        if (cmdArgsWithoutDuplicates.length < cmdArgs.length) {
            $.get('_markup/ugui-multiargnames.htm', function (multiArgNamesMarkup) {
                //Put alert message at the top of page
                $('body.dev').prepend(multiArgNamesMarkup);
            });
            //Keep the console warning formatted nicely for cli filenames under 16 characters in length
            var spacesNeeded = 16 - executable[index].length;
            var spaces = '';
            if (spacesNeeded > 0) {
                for (subindex = 0; subindex < spacesNeeded; subindex ++) {
                    spaces = spaces + ' ';
                }
            }
            console.warn('');
            console.warn('////////////////////////////////////////');
            console.warn('// All data-argName\'s must be unique. //');
            console.warn('// FOUND IN ' + executable[index].toUpperCase() + ' SECTION. ' + spaces + '//');
            console.warn('////////////////////////////////////////');
        }
    }
}














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## F00. UGUI Developer Toolbar
//
//The UGUI Developer Toolbar appears at the bottom of your app
//when the `<body>` has a class of `dev`. It is meant to be
//informative and give you access to quick/common tasks.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F01. Detect if in Developer environment
//
//>Detects if you're in Development or Production environment.
//
//>If you have a class of `dev` or `prod` in the `body` tag
// UGUI will enable key bindings such as `F12` or
// `CTRL+Shift+I` to launch Webkit's Developer Tools, or `F5`
// to refresh. Also it displays the Command Line output at the
// bottom of the page.

//Check if the body has a class of prod for Production Environment
if ($('body').hasClass('prod')) {
    $('#uguiDevTools').remove();
} else if ($('body').hasClass('dev')) {
    //Grab the UGUI Developer Toolbar markup
    $.get('_markup/ugui-devtools.htm', function (uguiDevToolsMarkup) {
        //Put Developer Toolbar markup on the page
        $('body.dev').append(uguiDevToolsMarkup);
        //Update the UGUI version to the correct version
        $('#uguiDevTools .versionUGUI').html(window.ugui.version);
        fillExecutableDropdowns();
        putExeHelpInDevTools();
        $('#uguiDevTools section').addClass('shrink');
        $('#uguiDevTools section *').addClass('shrink');
        $('#uguiDevTools').show();

        //Hide/Show based on UGUI Dev Tools navigation
        $('#uguiDevTools nav span').click(function () {
            var sectionClicked = $(this).attr('data-nav');
            $('#uguiDevTools nav span').removeClass('selected');

            if ($('#uguiDevTools section.' + sectionClicked).hasClass('shrink')) {
                $('#uguiDevTools nav span[data-nav=' + sectionClicked + ']').addClass('selected');
                $('#uguiDevTools section').addClass('shrink');
                $('#uguiDevTools section *').addClass('shrink');
                $('#uguiDevTools section.' + sectionClicked).removeClass('shrink');
                $('#uguiDevTools section.' + sectionClicked + ' *').removeClass('shrink');
            } else {
                $('#uguiDevTools nav span[data-nav=' + sectionClicked + ']').removeClass('selected');
                $('#uguiDevTools section.' + sectionClicked).addClass('shrink');
                $('#uguiDevTools section.' + sectionClicked + ' *').addClass('shrink');
            }
        });

        swatchSwapper();

        //When the developer clicks "Keep"
        $('#setNewSwatch').click(function () {
            //The currently selected swatch
            var newSwatch = $('#swatchSwapper').val();
            //Update index.htm to use the selected swatch as the new default
            saveNewSwatch(newSwatch);
        });

        openDefaultBrowser();

        //Update the UGUI Developer Toolbar's 'CMD Output' section
        updateUGUIDevCommandLine();
        $('#uguiDevTools .uguiCommand .executableName').change(updateUGUIDevCommandLine);
    });

    //Get the window object
    var win = require('nw.gui').Window.get();

    //Keyboard shortcuts
    keyBindings();

    //Check for duplicate `data-argName`s
    warnIfDuplicateArgNames();
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F02. Put all executables in dropdowns
//
//>In the UGUI Developer Toolbar, there are dropdowns in the
// "CMD Output" and "Executable Info" sections that contain all
// of the executables used in the app.

//
function fillExecutableDropdowns () {
    //Check each file and put it in the dropdown box
    for (index = 0; index < executable.length; index++) {
        $('.executableName').append('<option value="' + executable[index] + '">' + executable[index] + '</option>');
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F03. Real-time updating dev tool command output
//
//>This updates the contents the UGUI Developer Toolbar's
// "CMD Output" section whenever the user interacts with any
// form elements.

// Make sure we're in dev mode first
if ($('body').hasClass('dev')) {

    // Cycle through all executables used by the app
    for (index = 0; index < executable.length; index++) {
        // If any of the form elements with a `data-argName` change
        $(argsForm[index]).change(function () {
            // Check if it was the drag/drop input box
            if ($(this).parent().hasClass('ezdz')) {
                var file = this.files[0];
                // pass in the data-argName to EZDZ
                file.argName = $(this).attr('data-argName');
                //Run a custom function before updating dev tools
                ezdz(file);
            }

            //Update the UGUI Developer Toolbar's "CMD Output" section
            updateUGUIDevCommandLine();
        });
    }

    //If the user types anything in a form
    $(textFields).keyup(updateUGUIDevCommandLine);
    $(textFields).blur(updateUGUIDevCommandLine);
    $('.slider').on('slide', updateUGUIDevCommandLine);
} else {
    //If we're not in `dev` mode, make sure the EZDZ can still run
    $('.ezdz input').change(function () {
        var file = this.files[0];
        //pass in the data-argName to EZDZ
        file.argName = $(this).attr('data-argName');
        ezdz(file);
    });
}

function updateUGUIDevCommandLine () {
    //Clear it out first
    $('#commandLine').empty();

    //Get the executable from the dropdown lists
    var pickedExecutable = $('.uguiCommand .executableName').val();

    //For apps that don't use `<cmd>` blocks, skip this section
    if (pickedExecutable != null) {
        //Get an array of all the commands being sent out
        var devCommandOutput = buildCommandArray(pickedExecutable);
        var devCommandOutputSpaces = [];

        for (var index = 0; index < devCommandOutput.length; index++) {
            if (devCommandOutput[index] !== '') {
                devCommandOutputSpaces.push(' ' + devCommandOutput[index]);
            }
        }

        //Replace the text in the "CMD Output" section of the UGUI Developer Toolbar
        $('#commandLine').html(devCommandOutputSpaces);
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F04. Put CLI help info in UGUI Dev Tools
//
//>This function is only ran when in dev mode. It adds another
// tab in the UGUI Developer Tools that returns information
// from the user's executable with arguments like `--help`.

//
function putExeHelpInDevTools () {
    //Every time the dropdown changes update the `<pre>`
    $('#uguiDevTools .executableName').change(getHelpInfo);
    $('#uguiDevTools .helpDropdown').change(getHelpInfo);

    function getHelpInfo () {
        //Grab the correct executable from the dropdown
        var executableChoice = $('.uguiExecutable .executableName').val();
        //Grab which kind of help argument they chose, like `--help` or `/?`
        var helpChoice = $('.uguiExecutable .helpDropdown').val();

        //Don't run if there isn't a help choice
        if (helpChoice) {
            //Run the executable using the user's chosen argument to get its help info
            runcmd(executableChoice + ' ' + helpChoice, function (returnedHelpInfo) {
                //Put the help info in a `<pre>`
                $('#uguiDevTools pre.executableHelp').text(returnedHelpInfo);
            });
        }
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F05. Swap Bootswatches
//
//>This function is only ran when in dev mode. It grabs a list
// of all files in the `_themes` folder and puts them in
// a dropdown box in UGUI Developer Toolbar so developers can
// try out different stylesheets.

//
function swatchSwapper () {
    //Grab all the files in the `_themes` folder and put them in an array
    fs.readdir('scout-files/_themes', function (err, files) {
        //If that works
        if (!err) {
            //Check each file and put it in the dropdown box
            for (index = 0; index < files.length; index++) {
                var cssFileName = files[index];                     //cerulean.min.css
                var swatchName = files[index].split('.min.css')[0]; //cerulean
                $('#swatchSwapper').append(
                    '<option value="_themes/' + cssFileName + '">' +
                      swatchName +
                    '</option>'
                );
            }
        } else {
            console.warn(º + 'Could not return list of style swatches.', consoleBold);
        }
    });

    //When you change what is selected in the dropdown box, swap out the current swatch for the new one.
    $('#swatchSwapper').change(function () {
        $('head link[data-swatch]').attr('href', $('#swatchSwapper').val());
        //Nav logo wasn't vertically centering after changing a stylesheet because the function was being ran after
        //the stylesheet was swapped instead of after the page rendered the styles. Since Webkit does not have a way of
        //indicating when a repaint finishes, unfortunately a delay had to be used. 71 was chosen because 14 FPS is the
        //slowest you can go in animation before something looks choppy.
        window.setTimeout(centerNavLogo, 140);
        window.setTimeout(sliderHandleColor, 140);
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F06. Save chosen Bootswatch
//
//>In the "Style Swapper" section of UGUI Developer Toolbar,
// when the user clicks the "Use this style" button,
// read the contents of the index.htm, find the line that sets
// which swatch CSS to use and update it to the new chosen
// swatch. Then replace the contents of index.htm with the new
// data so on every load it uses the correct swatch.

//
function saveNewSwatch (newSwatch) {
    //Validate that the required argument is passed and is the correct type
    if (!newSwatch || typeof(newSwatch) !== 'string') {
        console.info(º + 'You must pass in a new swatch as a string', consoleNormal);
        return;
    }

    //Set the filename to whatever the page is NW.js opens on launch, like index.htm
    var filename = window.ugui.app.startPage;

    //Read the contents of index.htm like a normal file and put them in the "data" variable
    fs.readFile(filename, 'utf8', function (err, data) {
        //If it can't read it for some reason, throw an error
        if (err) {
            return console.log(err);
        }

        //Set up for the regex
        var re_start = '(<link rel="stylesheet" href="_themes\\/)';
        var re_file = '((?:[a-z][a-z\\.\\d_]+)\\.(?:[a-z\\d]{3}))(?![\\w\\.])';
        var re_end = '(" data-swatch="swapper">)';

        //Would match: `<link rel="stylesheet" href="_themes/cerulean.min.css" data-swatch="swapper">`
        var createRegex = RegExp(re_start + re_file + re_end, ['i']);
        var findSwatchLine = createRegex.exec(data);
        //If we could find the line in the file
        if (findSwatchLine != null) {
            //Though not currently using this line, it may come in handy someday
            //`var currentSwatch = findSwatchLine[52];`

            var lineToFind = '<link rel="stylesheet" href="' + newSwatch + '" data-swatch="swapper">';

            //Take the contents of index.htm, find the correct line, and replace that line with the updated swatch
            data = data.replace(createRegex, lineToFind);
        }

        //With the contents of index.htm update, save over the file
        fs.writeFile(filename, data, function (err) {
            if (err) {
                return console.log(err);
            }
        });

        //Animate the "Saved" text, having it fade in
        $('.newSwatchSaved').addClass('showSaved');
        //Wait 2 seconds and then fade the "Saved" text out
        setTimeout(function () {
            $('.newSwatchSaved').removeClass('showSaved');
        }, 2000);

    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### F07. Custom keyboard shortcuts
//
//>This function is only ran when in dev mode. It gives the
// developer access to common/expected keyboard shortcuts.

//
function keyBindings () {
    //Keyboard shortcuts
    document.onkeydown = function (pressed) {
        //Check `CTRL+F` key and do nothing :(
        if (pressed.ctrlKey && pressed.keyCode === 70) {
            pressed.preventDefault();
            console.info(º + 'NW.js currently has no "Find" feature built in. Sorry :(', consoleNormal);
            return false;
        //Check `CTRL+F5`, `CTRL+R`, or `CMD+R` keys and hard refresh the page
        } else if (
            pressed.ctrlKey && pressed.keyCode === 116 ||
            pressed.ctrlKey && pressed.keyCode === 82 ||
            pressed.metaKey && pressed.keyCode === 82) {
                pressed.preventDefault();
                window.scout.helpers.killAllWatchers();
                win.reloadDev();
                return false;
        //Check `Shift+F5` and `CMD+Shift+R` keys and refresh ignoring cache
        } else if (
            pressed.shiftKey && pressed.keyCode === 116 ||
            pressed.metaKey && pressed.shiftKey && pressed.keyCode === 82) {
                pressed.preventDefault();
                window.scout.helpers.killAllWatchers();
                win.reloadIgnoringCache();
                return false;
        //Check `F5` key and soft refresh
        } else if (pressed.keyCode === 116) {
            pressed.preventDefault();
            window.scout.helpers.killAllWatchers();
            win.reload();
            return false;
        //Check `F12`, `Ctrl+Shift+I`, or `Option+Shift+I` and display Webkit Dev Tools
        } else if (
            pressed.keyCode === 123 ||
            pressed.ctrlKey && pressed.shiftKey && pressed.keyCode === 73 ||
            pressed.altKey && pressed.shiftKey && pressed.keyCode === 73) {
                pressed.preventDefault();
                win.showDevTools();
                return false;
        }
    };
}














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## G00. Plugins
//
//Here are some plugins written by other's that are used to by
//UGUI to make things easier. Some of these have been modified.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//## G01. EZDZ: Drag and Drop
//
//>Code for drag/drop/browse box. This was originally based on
// EZDZ, but has been heavily modified for Bootstrap and NW.js
// for cross-platform and Bootswatch compatibility.
//
//>After dropping a file in the EZDZ box, put the file name in
// the EZDZ box. If the file is an image, display a thumbnail.
//
//>**Credits:** [EZDZ on GitHub](https://github.com/jaysalvat/ezdz)

//
$('.ezdz').on('dragover', function () {
    $(this).children('label').removeClass('text-info');    //Static
    $(this).children('label').removeClass('text-success'); //Dropped
    $(this).children('label').addClass('text-warning');    //Hover
});

$('.ezdz').on('dragleave', function () {
    $(this).children('label').removeClass('text-success'); //Dropped
    $(this).children('label').removeClass('text-warning'); //Hover
    $(this).children('label').addClass('text-info');       //Static
});

function ezdz (fileInfo) {
    //Validate that the required argument is passed and the correct type
    if (!fileInfo || typeof(fileInfo) !== 'object') {
        console.info(º + 'You must pass in your file information as an object.', consoleNormal);
        return;
    }
    var file = fileInfo;
    var element = '[data-argName="' + file.argName + '"]';

    $(element).siblings('label').removeClass('text-info');    //Static
    $(element).siblings('label').removeClass('text-warning'); //Hover

    if (this.accept && $.inArray(file.type, this.accept.split(/, ?/)) == -1) {
        return alert('File type not allowed.');
    }

    $(element).siblings('label').addClass('text-success');   //Dropped
    $(element).siblings('span img').remove();

    if ((/^image\/(gif|png|jpeg|jpg|webp|bmp|ico)$/i).test(file.type)) {
        /* var reader = new FileReader(file); */

        /* reader.readAsDataURL(file); */

        /* reader.onload = function (event) { */
            /* var data = event.target.result; */
            /* var $img = $('<img />').attr('src', data).fadeIn(); */
            var $img = $('<img />').attr('src', file.path).fadeIn();

            $(element).siblings('span img').attr('alt', 'Thumbnail of selected image.');
            $(element).siblings('span').html($img);
        /* }; */
    } else {
        $(element).siblings('span').children('img').remove();
    }

    //Update the text on screen to display the name of the file that was dropped
    var droppedFilename = file.name + ' selected';
    $(element).siblings('label').html(droppedFilename);
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### G02. Range slider
//
//>Enables all elements with a class of `slider` to use the
// boostrap-slider plugin.
//
//>**Documentation**: [http://seiyria.github.io/bootstrap-slider](http://seiyria.github.io/bootstrap-slider)

//Verify the developer is using Bootstrap slider
if (bootstrap3_enabled && slider_enabled) {
    //Initialize the bootstrap-slider plugin for all elements on the page with a class of `slider`
    $('.slider').slider({
        formatter: function (value) {
            return value;
        }
    });
}

//Since bootstrap-slider is a plugin and not officially part of Bootstrap,
//Bootswatches don't contain styles for them. So we manually set the styles.
function sliderHandleSolid (themeColor) {
    //Verify the developer is using Bootstrap slider
    if (bootstrap3_enabled && slider_enabled) {
        //Validate that the required argument is passed and the correct type
        if (!themeColor || typeof(themeColor) !== 'string') {
            console.info(º + 'You must pass in your theme color as a string in RGB format. Example:', consoleNormal);
            console.info(º + 'rgb(141, 12, 70)', consoleCode);
            return;
        }

        //If the navigation bar is white set the slider handle to gray
        if (themeColor == 'rgb(255, 255, 255)') {
            $('.slider .slider-handle').css('background-color', '#7E7E7E');
        } else {
            //Set the color of the slider handle to match the color of the navigation bar
            $('.slider .slider-handle').css('background-color', themeColor);
        }
    }
}

function sliderHandleGradient (themeGradient) {
    //Verify the developer is using Bootstrap slider
    if (bootstrap3_enabled && slider_enabled) {
        //Validate that the required argument is passed and the correct type
        if (!themeGradient || typeof(themeGradient) !== 'string') {
            console.info(º + 'You must pass in your theme gradient as a string in RGB format. Example:', consoleNormal);
            console.info(º + 'linear-gradient(rgb(84, 180, 235), rgb(47, 164, 231) 60%, rgb(29, 156, 229))', consoleCode);
            return;
        }

        $('.slider .slider-handle').css('background-image', themeGradient);
    }
}

function sliderTrackAndTickColor () {
    //Verify the developer is using Bootstrap slider
    if (bootstrap3_enabled && slider_enabled) {
        var bgColor = '#D5D5D5';
        $('.slider-tick.in-selection').css('background-color', bgColor);
        $('.slider-tick.in-selection').css('background-image',  'linear-gradient(' + bgColor + ', ' + bgColor + ')');
        $('.slider-selection.tick-slider-selection').css('background-color', bgColor);
        $('.slider-selection.tick-slider-selection').css('background-image', 'linear-gradient(' + bgColor + ', ' + bgColor + ')');
    }
}

function sliderHandleColor () {
    //Verify the developer is using Bootstrap slider and that the navbar exists
    if (bootstrap3_enabled && slider_enabled && ($('.navbar').length > 0)) {
        //Remove the color of the slider handle
        $('.slider .slider-handle').css('background-image', 'none');

        // Get the color of the navigation bar
        var themeColor = $('.navbar').css('background-color');
        // Get the background image or gradient
        var themeGradient = $('.navbar').css('background-image');

        if (themeGradient == 'none') {
            sliderHandleSolid(themeColor);
        } else {
            sliderHandleGradient(themeGradient);
        }

        sliderTrackAndTickColor();
    }
}

//Verify the developer is using Bootstrap slider
if (bootstrap3_enabled && slider_enabled) {
    //Run once on page load
    sliderHandleColor();
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### G03. Cut/Copy/Paste context menu
//
//>Right-click on any text or text field and you can now C&P!
//
//>**Credit**: [nw-contextmenu on GitHub](https://github.com/b1rdex/nw-contextmenu)

//
function cutCopyPasteMenu () {
    function Menu (cutLabel, copyLabel, pasteLabel) {
        var gui = require('nw.gui');
        var menu = new gui.Menu();

        var cut = new gui.MenuItem({
            label: cutLabel || 'Cut',
            click: function () {
                document.execCommand('cut');
                console.log('Menu:', 'cut to clipboard');
            }
        });
        var copy = new gui.MenuItem({
            label: copyLabel || 'Copy',
            click: function () {
                document.execCommand('copy');
                console.log('Menu:', 'copied to clipboard');
            }
        });
        var paste = new gui.MenuItem({
            label: pasteLabel || 'Paste',
            click: function () {
                document.execCommand('paste');
                console.log('Menu:', 'pasted to textarea');
            }
        });

        menu.append(cut);
        menu.append(copy);
        menu.append(paste);

        return menu;
    }

    var menu = new Menu(/* pass cut, copy, paste labels if you need in */);
    $(document).on('contextmenu', function (event) {
        event.preventDefault();
        menu.popup(event.originalEvent.x, event.originalEvent.y);
    });
}

//Run once on page load
cutCopyPasteMenu();







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### G04. Open New Window
//
//>Simple means of opening a new Window. It defaults to the
// settings you've placed in the package.json `window` object.

//
function openNewWindow (url, parameters) {
    //Validate that required argument is passed
    if (!url) {
        console.info(º + 'Supply a path to the file you want to load as ' +
            'the url for the new Window.', consoleNormal);
        return;
    //Validate types
    } else if (typeof(url) !== 'string') {
        console.info(º + 'URL must be passed as a string.', consoleNormal);
        return;
    }

    //Check if the user is using custom parameters
    if (parameters) {
        //Validate types
        if (Object.prototype.toString.call(parameters) !== '[object Object]') {
            console.info(º + 'Your parameters must be passed as an object.', consoleNormal);
            return;
        } else if (parameters.title && typeof(parameters.title) !== 'string') {
            console.info(º + 'Title for your window must be passed as a string. Example:', consoleNormal);
            console.info(º + '"My App"', consoleCode);
            return;
        } else if (parameters.icon && typeof(parameters.icon) !== 'string') {
            console.info(º + 'Icon for your window must be passed as a string. Example:', consoleNormal);
            console.info(º + '"_img/icon32.png"', consoleCode);
            return;
        } else if (parameters.toolbar && typeof(parameters.toolbar) !== 'boolean') {
            console.info(º + 'Toolbar visibility for your window must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'true', consoleCode);
            return;
        } else if (parameters.resizable && typeof(parameters.resizable) !== 'boolean') {
            console.info(º + 'Window resizability must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'true', consoleCode);
            return;
        } else if (parameters.visible && typeof(parameters.visible) !== 'boolean') {
            console.info(º + 'Window visibility must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'true', consoleCode);
            return;
        } else if (parameters.transparent && typeof(parameters.transparent) !== 'boolean') {
            console.info(º + 'Window transparency must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'false', consoleCode);
            return;
        } else if (parameters.width && typeof(parameters.width) !== 'number') {
            console.info(º + 'Width for your window must be passed as a number. Example:', consoleNormal);
            console.info(º + '900', consoleCode);
            return;
        } else if (parameters.height && typeof(parameters.height) !== 'number') {
            console.info(º + 'Height for your window must be passed as a number. Example:', consoleNormal);
            console.info(º + '500', consoleCode);
            return;
        } else if (parameters.min_width && typeof(parameters.min_width) !== 'number') {
            console.info(º + 'Minimum width for your window must be passed as a number. Example:', consoleNormal);
            console.info(º + '400', consoleCode);
            return;
        } else if (parameters.min_height && typeof(parameters.min_height) !== 'number') {
            console.info(º + 'Minimum height for your window must be passed as a number. Example:', consoleNormal);
            console.info(º + '200', consoleCode);
            return;
        } else if (parameters.max_width && typeof(parameters.max_width) !== 'number') {
            console.info(º + 'Maximum width for your window must be passed as a number. Example:', consoleNormal);
            console.info(º + '8000', consoleCode);
            return;
        } else if (parameters.max_height && typeof(parameters.max_height) !== 'number') {
            console.info(º + 'Maximum height for your window must be passed as a number. Example:', consoleNormal);
            console.info(º + '8000', consoleCode);
            return;
        } else if (parameters.position && typeof(parameters.position) !== 'string') {
            console.info(º + 'Position of your window must be passed as a string. Example:', consoleNormal);
            console.info(º + '"center"', consoleCode);
            return;
        } else if (parameters['always-on-top'] && typeof(parameters['always-on-top']) !== 'boolean') {
            console.info(º + 'Setting your window to Always On Top must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'false', consoleCode);
            return;
        } else if (parameters.show_in_taskbar && typeof(parameters.show_in_taskbar) !== 'boolean') {
            console.info(º + 'Show window in taskbar must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'true', consoleCode);
            return;
        } else if (parameters.fullscreen && typeof(parameters.fullscreen) !== 'boolean') {
            console.info(º + 'Fullscreen for your window must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'false', consoleCode);
            return;
        } else if (parameters.frame && typeof(parameters.frame) !== 'boolean') {
            console.info(º + 'Window frame must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'true', consoleCode);
            return;
        } else if (parameters.as_desktop && typeof(parameters.as_desktop) !== 'boolean') {
            console.info(º + 'Show window as desktop must be passed as a boolean. Example:', consoleNormal);
            console.info(º + 'false', consoleCode);
            return;
        }
    //If parameters were not passed in
    } else {
        //create an empty object
        parameters = {};
    }

    var gui = require('nw.gui');
    var defaults = gui.App.manifest.window;

    //Use the parameters passed in, fallback to the options in package.json, and if those don't exist use UGUI defaults
    var newWindowOptions = {
        'title'           : parameters.title            || defaults.title            || 'New Window',
        'icon'            : parameters.icon             || defaults.icon             || '_img/icon32.png',
        'toolbar'         : parameters.toolbar          || defaults.toolbar          || true,
        'resizable'       : parameters.resizable        || defaults.resizable        || true,
        'visible'         : parameters.visible          || defaults.visible          || true,
        'transparent'     : parameters.transparent      || defaults.transparent      || false,
        'width'           : parameters.width            || defaults.width            || 900,
        'height'          : parameters.height           || defaults.height           || 550,
        'min_width'       : parameters.min_width        || defaults.min_width        || 400,
        'min_height'      : parameters.min_height       || defaults.min_height       || 200,
        'max_width'       : parameters.max_width        || defaults.max_width        || 8000,
        'max_height'      : parameters.max_height       || defaults.max_height       || 8000,
        'position'        : parameters.position         || defaults.position         || 'center',
        'always-on-top'   : parameters['always-on-top'] || defaults['always-on-top'] || false,
        'show_in_taskbar' : parameters.show_in_taskbar  || defaults.show_in_taskbar  || true,
        'fullscreen'      : parameters.fullscreen       || defaults.fullscreen       || false,
        'frame'           : parameters.frame            || defaults.frame            || true,
        'as_desktop'      : parameters.as_desktop       || defaults.as_desktop       || false
    };

    //Launch the new window
    gui.Window.open(url, newWindowOptions);
}














//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
//## H00. Settings
//
//This section deals with saving/loading settings and exposing
//parts of UGUI to the developer.
//
//
//
//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### H01. Save settings
//
//>This saves the settings of your app into a local user
// account specific folder on the computer that is different
// for each Operating System. You can run the following to see
// what the default location is on your OS:
//
//>     ugui.helpers.saveSettings(["Show Default"]);
//
//>Or you can pass in a custom path for the location of your
// settings file. Add `data-argName` to an element in your HTML
// to ensure it gets saved automatically.
//
//>Add a class of `do-not-save` for items you don't want to be
// updated during `loadSettings()`

//
function saveSettings (customLocation, callback) {
    var gui = require('nw.gui');

    var defaultLocation = '';

    //If you're on windows then folders in file paths are separated with `\`, otherwise OS's use `/`
    if (process.platform == 'win32') {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + '\\uguisettings.json');
    } else {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + '/uguisettings.json');
    }

    //If a custom location isn't passed into the function, use the default location for the settings file
    var settingsFile = defaultLocation;

    //Validate types  
    //Check if only one argument was passed into `saveSettings` and if it was a string or function.
    //Check if two arguments were passed into `saveSettings` and if the first one is a string.
    //Check if two arguments were passed into `saveSettings` and if the second one is a function
    if (
        (arguments.length === 1 && (typeof(customLocation) !== 'string') && (typeof(customLocation) !== 'function')) ||
        (arguments.length === 2 && typeof(customLocation) !== 'string') ||
        (arguments.length === 2 && typeof(callback) !== 'function')
       ) {
        console.info(º + 'The following arguments are allowed:', consoleBold);
        console.info(º + '1. Just a string to a custom file path.', consoleNormal);
        console.info(º + 'ugui.helpers.saveSettings("C:\\folder\\app-settings.json" );', consoleCode);
        console.info(º + '2. Just a function as a callback to be ran when save completes.', consoleNormal);
        console.info(º + 'ugui.helpers.saveSettings(function () {console.log("Saved.")} );', consoleCode);
        console.info(º + '3. A string followed by a function, as a custom path and ' +
            'callback upon completion.', consoleNormal);
        console.info(º + 'ugui.helpers.saveSettings("C:\\folder\\app-settings.json", ' +
            'function () {console.log("Saved.")} );', consoleCode);
        console.info(º + '4. Nothing at all.', consoleNormal);
        console.info(º + 'ugui.helpers.saveSettings();', consoleCode);
        console.info(º + 'By passing in nothing, UGUI will use the default save location of:', consoleNormal);
        console.info(º + '"' + defaultLocation + '"', consoleCode);
        console.info(º + 'And upon completion of saving the settings, nothing will be triggered.', consoleNormal);
        return;
    //Check if `customLocation` is exists and is a string
    } else if (customLocation && typeof(customLocation) === 'string') {
        //Set the settings file to the custom, passed in, location
        settingsFile = customLocation;
    }

    //Make sure the UGUI Args Object is up to date
    window.ugui.helpers.buildUGUIArgObject();

    //Grab the UGUI Args Object and JSONify it
    var settingsJSON = JSON.stringify(ugui.args);

    //Save the `ugui.args` object to the `uguisettings.json` file
    fs.writeFile(settingsFile, settingsJSON, function (err) {
        if (err) {
            console.warn(º + 'There was an error in attempting to save to the location:', consoleNormal);
            console.warn(º + settingsFile, consoleCode);
            console.warn(º + 'Error: ', consoleBold);
            console.warn(º + err.message, consoleError);
        } else {
            //If a callback function was passed into `saveSettings`, run it
            if (typeof(callback) === 'function') {
                callback();
            } else if (typeof(customLocation) === 'function') {
                customLocation();
            }
        }
    });
}

//Make sure anything is a class of `save-ugui-settings` is wired up to save the UGUI settings
$('.save-ugui-settings').click(function () {
    saveSettings();
});







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### H02. Load settings
//
//>This loads your settings from the default save location or
// a location that you've passed in. It reads the file, which
// is a JSON version of the `ugui.args` object, and updates
// the UI elements on the page with the correct values, then
// updates the current `ugui.args` to reflect the UI changes.
//
//>To have an HTML element skipped during the load process,
// give it a class of `do-not-save`.

//
function loadSettings (customLocation, callback) {
    var gui = require('nw.gui');

    var defaultLocation = '';

    //If you're on windows then folders in file paths are separated with `\`, otherwise OS's use `/`
    if (process.platform == 'win32') {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + '\\uguisettings.json');
    } else {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + '/uguisettings.json');
    }

    //If a custom location isn't passed into the function, use the default location for the settings file
    var settingsFile = defaultLocation;

    //Validate types  
    //Check if only one argument was passed into `loadSettings` and if it was a string or function.
    //Check if two arguments were passed into `loadSettings` and if the first one is a string.
    //Check if two arguments were passed into `loadSettings` and if the second one is a function.
    if (
        (arguments.length === 1 && (typeof(customLocation) !== 'string') && (typeof(customLocation) !== 'function')) ||
        (arguments.length === 2 && typeof(customLocation) !== 'string') ||
        (arguments.length === 2 && typeof(callback) !== 'function')
       ) {
        console.info(º + 'The following arguments are allowed:', consoleBold);
        console.info(º + '1. Just a string to a custom file path.', consoleNormal);
        console.info(º + 'ugui.helpers.loadSettings("C:\\folder\\app-settings.json");', consoleCode);
        console.info(º + '2. Just a function as a callback to be ran when loading completes.', consoleNormal);
        console.info(º + 'ugui.helpers.loadSettings(function () {console.log("Loaded.")});', consoleCode);
        console.info(º + '3. A string followed by a function, as a custom path and ' +
            'callback upon completion.', consoleNormal);
        console.info(º + 'ugui.helpers.loadSettings("C:\\folder\\app-settings.json", ' +
            'function () {console.log("loadd.")});', consoleCode);
        console.info(º + '4. Nothing at all.', consoleNormal);
        console.info(º + 'ugui.helpers.loadSettings();', consoleCode);
        console.info(º + 'By passing in nothing, UGUI will use the default load location of:', consoleNormal);
        console.info(º + '"' + defaultLocation + '"', consoleCode);
        console.info(º + 'And upon completion of loading the settings, UI elements on the ' +
            'page will be updated, as will the UGUI Args Object.', consoleNormal);
        return;
    //Check if `customLocation` is exists and is a string
    } else if (customLocation && typeof(customLocation) === 'string') {
        //Set the settings file to the custom, passed in, location
        settingsFile = customLocation;
    }

    //Attempt to read the file
    fs.readFile(settingsFile, {encoding: 'utf-8'}, function (err, data) {
        //Display console warning if unable to read the file
        if (err) {
            console.warn(º + 'Could not read settings file from location:', consoleNormal);
            console.warn(º + '"' + settingsFile + '"', consoleCode);
            console.warn(º + 'Error:', consoleBold);
            console.warn(º + err.message, consoleError);
            return;
        //Load the file if it's found
        } else {
            var settingsObj = JSON.parse(data);
            //Iterate through the saved settings and update the UI
            for (var key in settingsObj) {
                var htmltype = settingsObj[key].htmltype;
                var htmlticked = settingsObj[key].htmlticked;

                //Check if the key has a corresponding UI element
                //and that it isn't set to 'do not save'
                if ($('[data-argName' + key + ']') && !($('[data-argName' + key + ']').hasClass('do-not-save'))) {
                    /* console.log(htmltype); */
                    //If `<input type='file'>` and it has value
                    if (htmltype == 'folder' && settingsObj[key].value !== '') {
                        //Create an object with the correct file properties
                        var folder = {
                            'argName': key,
                            'folderName': settingsObj[key].folderName,
                            'fullpath': settingsObj[key].fullpath,
                            'type': settingsObj[key].type,
                            'path': settingsObj[key].path,
                            'size': settingsObj[key].size,
                            'lastModified': settingsObj[key].lastModified,
                            'lastModifiedDate': settingsObj[key].lastModifiedDate,
                            'webkitRelativePath': settingsObj[key].webkitRelativePath,
                            'htmltag': settingsObj[key].htmltag,
                            'htmltype': settingsObj[key].htmltype
                        };
                        //Set the matching UI element in the app with the above properties
                        $('[data-argName=' + key + ']')[0].files[0] = folder;

                        //Update EZDZ if the element is using it
                        if ($('[data-argName=' + key + ']').parent().hasClass('ezdz')) {
                            //Run EZDZ to update visuals on the page
                            ezdz(folder);
                        }
                    //If `<input type='file'>` and it has value
                    } else if (htmltype == 'file' && settingsObj[key].value !== '') {
                        //Create an object with the correct file properties
                        var file = {
                            'argName': key,
                            'type': settingsObj[key].type,
                            'path': settingsObj[key].fullpath,
                            'name': settingsObj[key].nameExt,
                            'size': settingsObj[key].size,
                            'lastModified': settingsObj[key].lastModified,
                            'lastModifiedDate': settingsObj[key].lastModifiedDate,
                            'webkitRelativePath': settingsObj[key].webkitRelativePath
                        };
                        //Set the matching UI element in the app with the above properties
                        $('[data-argName=' + key + ']')[0].files[0] = file;

                        //Update EZDZ if the element is using it
                        if ($('[data-argName=' + key + ']').parent().hasClass('ezdz')) {
                            //Run EZDZ to update visuals on the page
                            ezdz(file);
                        }
                    //If `<input type='checkbox'>` or `<input type='radio'>`
                    } else if (htmltype == 'checkbox' || htmltype == 'radio') {
                        //Set the value of the element as checked or not
                        if (htmlticked == true) {
                            $('[data-argName=' + key + ']').prop('checked', true);
                        } else {
                            $('[data-argName=' + key + ']').prop('checked', false);
                        }
                    //If the setting is for a radio in one of Bootstrap's fake dropdowns
                    } else if (htmltype == 'dropdown' && htmlticked == true) {
                        //Force the UI to be updated
                        $('[data-argName=' + key + ']').trigger('click');
                    //If the setting is for a range slider
                    } else if (htmltype == 'range') {
                        //Check if the value is not a number, like `'0,25'` rather than `2`
                        if (isNaN(settingsObj[key].value)) {
                            //Split `0,25` into `0` and `25` and return them as numbers instead of strings
                            var parsedValue = settingsObj[key].value.split(',').map(function (num) {
                                return parseInt(num);
                            });
                            //Set the value to `0,25` and the data-slider-value to `[0,25]`
                            $('[data-argName=' + key + ']').slider('setValue', parsedValue);
                            $('[data-argName=' + key + ']').attr('data-slider-value', '[' + parsedValue + ']');
                        } else {
                            //Set the value to `2`
                            $('[data-argName=' + key + ']').slider('setValue', parseInt(settingsObj[key].value));
                        }
                    //If `<textarea>`
                    } else if (htmltype == 'textarea') {
                        //Set the value and UI text for the matching `<textarea>` in the app
                        $('[data-argName=' + key + ']').val(settingsObj[key].value);
                        $('[data-argName=' + key + ']').text(settingsObj[key].value);
                    //Catch-all for any generic other input types
                    } else if (settingsObj[key].value) {
                        //Set the value for the matching element
                        $('[data-argName=' + key + ']').val(settingsObj[key].value);
                    }
                }
            }

            //You can never sanitize your inputs enough!
            removeTypedQuotes();
            //Update the UGUI Developer Toolbar and unlock/lock submit buttons accordingly  
            //`updateUGUIDevCommandLine` will run `buildUGUIArgObject` and `patternMatchingDefinitionEngine`
            updateUGUIDevCommandLine();
            unlockSubmit();

            //If a callback function was passed into `saveSettings`, run it
            if (typeof(callback) === 'function') {
                callback();
            } else if (typeof(customLocation) === 'function') {
                customLocation();
            }
        }
    });
}

//Make sure anything is a class of `load-ugui-settings` is wired up to load the UGUI settings
$('.load-ugui-settings').click(function () {
    loadSettings();
});







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### H03. The UGUI Object
//
//>We expose parts of UGUI to developers via the UGUI object.
// To quickly access what is available type 'ugui' into the
// NW.js (Webkit) Developer Tools console.

//
window.ugui = {
    'allArgElements': allArgElements,
    'app': {
        'author': authorName,
        'description': appDescription,
        'name': appName,
        'packageJSON': packageJSON,
        'pathToProject': pathToProject,
        'startPage': indexFile,
        'title': appTitle,
        'version': appVersion
    },
    'args': window.ugui.args,
    'executable': executable,
    'helpers': {
        'buildCommandArray': buildCommandArray,
        'buildUGUIArgObject': buildUGUIArgObject,
        'centerNavLogo': centerNavLogo,
        'convertCommandArraytoString': convertCommandArraytoString,
        'createAFolder': createAFolder,
        'deleteAFile': deleteAFile,
        'deleteAFolder': deleteAFolder,
        'findKeyValue': findKeyValue,
        'getFileSize': getFileSize,
        'loadSettings': loadSettings,
        'openDefaultBrowser': openDefaultBrowser,
        'openFolder': openFolder,
        'openNewWindow': openNewWindow,
        'parseArgument': parseArgument,
        'patternMatchingDefinitionEngine': patternMatchingDefinitionEngine,
        'readAFile': readAFile,
        'readAFolder': readAFolder,
        'removeTypedQuotes': removeTypedQuotes,
        'runcmd': runcmd,
        'runcmdAdvanced': runcmdAdvanced,
        'saveSettings': saveSettings,
        'setZoomPercent': setZoomPercent,
        'sliderHandleSolid': sliderHandleSolid,
        'sliderHandleGradient': sliderHandleGradient,
        'sliderHandleColor': sliderHandleColor,
        'updateUGUIDevCommandLine': updateUGUIDevCommandLine,
        'writeToFile': writeToFile
    },
    'platform': process.platform,
    'textFields': textFields,
    'version': uguiVersion
};







// End of `ugui();`
})(window, window.$);














/***********************************************************************/
/*                                                                     */
/*  /////////////////////////////////////////////////////////////////  */
/*  //                                                             //  */
/*  //                    ANNOTATED SOURCE CODE                    //  */
/*  //                                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  // 1. Introduction                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  //                                                             //  */
/*  // This document's comments have been written specifically     //  */
/*  // with MarkDown and Docco in mind. Markdown is a simple way   //  */
/*  // to add formatting to text that can then be converted to     //  */
/*  // HTML. It is used by sites like GitHub, StackOverflow, and   //  */
/*  // Reddit. Since the UGUI project is hosted on GitHub and its  //  */
/*  // community is based in ugui.reddit.com, it seemed logical    //  */
/*  // MarkDown be the common language used for the documentation. //  */
/*  // Fortunately Jeremy Ashkenas created a tool called Docco     //  */
/*  // that allows you to easily generate an HTML file from your   //  */
/*  // source files.                                               //  */
/*  //                                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  // 2. Running Docco/updating the documentation                 //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  //                                                             //  */
/*  // These instructions will be updated when a more routine      //  */
/*  // method is developed.                                        //  */
/*  //                                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*                                                                     */
/***********************************************************************/
