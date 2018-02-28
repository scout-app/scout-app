/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */

// BUILDING FOR WINDOWS/LINUX:

// Prerequisites: Must have Node and NPM installed globally.
//
// This assumes you have a folder next to `scout-app` called
// * `scout-app-build/win32/Scout-App`
// * `scout-app-build/lin64/Scout-App`
// * `scout-app-build/lin32/Scout-App`
//
// The `scout-app-build/XXXX/Scout-App` folder should contain:
//  * locales (folder)
//  * ffmpegsumo.dll
//  * icudtl.dat
//  * nw.pak
//  * Scout-App.exe
// (Or the Linux equivalents)
//
// All of those are from NW.js 0.12.3, the .exe is a renamed version of
// `nw.exe` with a custom icon and modified version number using Resource Hacker.

// BUILDING FOR OSX:
// Prerequisites: Must have Node and NPM installed globally.
//
// This assumes you have a folder next to `scout-app` called `scout-app-build`
// `scout-app-build` folder should contain the last Scout-App.app file that was released


// Variables
var start = Date.now() + '';
var os = process.platform;
var win = false;
var lin = false;
var darwin = false;
if (os == 'win32')  { win = true; }
if (os == 'linux')  { lin = true; }
if (os == 'darwin') { darwin = true; }
if (os == 'freebsd' || os == 'sunos' || (os != 'win32' && os != 'linux' && os != 'darwin')) {
    lin = true;
    console.log('UNSUPPORTED OPERATING SYSTEM');
    console.log('Build will probably fail.');
}
var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').execSync;
// var rimraf = require('rimraf'); // used to set number of retries for async deleting of in use files
// var del = require('del'); // used to delete entire folders with the exception of specific files
var manifest = fs.readJsonSync('package.json');
if (darwin) {
    delete manifest.scripts.postinstall;
}
delete manifest.devDependencies;
if (lin) {
    manifest.window.icon = 'scout-files/_img/logo_128.png';
}
var build = '../scout-app-build/win32/Scout-App/';
if (darwin) {
    build = '../scout-app-build/Scout-App.app/Contents/Resources/app.nw/';
} else if (lin) {
    build = '../scout-app-build/lin64/Scout-App/';
}
var build32 = '../scout-app-build/lin32/Scout-App/';
var sf = 'scout-files/';
var bindings = '_assets/node-sass_v4.5.3/';
var ns = 'node_modules/node-sass/vendor/';

// Functions
function timer (finish, begin) {
    // 3195
    var subtract = finish - begin;
    // 319.5 becomes 320
    var round = Math.round(subtract / 10);
    // 320 becomes 3.2
    var seconds = round / 100;
    // 3.2 becomes ['3', '2']
    var splitSeconds = seconds.toString().split('.');
    if (splitSeconds[0].length < 2) {
        // '3' becomes ' 3'
        splitSeconds[0] = ' ' + splitSeconds[0];
    }
    if (splitSeconds.length == 1 || splitSeconds[1].length < 1) {
        // '' becomes '00'
        splitSeconds[1] = '00';
    } else if (splitSeconds[1].length == 1) {
        // '2' becomes '20'
        splitSeconds[1] = splitSeconds[1] + '0';
    }
    if (splitSeconds[0].length == 3) {
        splitSeconds[1] = splitSeconds[1][0];
    }
    // [' 3', '20'] becomes ' 3.20 seconds'
    var time = splitSeconds.join('.') + ' seconds';
    return time;
}

function minutes (finish, begin) {
    // 82500
    var subtract = finish - begin;
    // 82500 = 1.375
    var minutes = subtract / 60000;
    minutes = Math.round(minutes * 1000) / 1000;
    // 1.375 = ['1', '375']
    var splitMinutes = minutes.toString().split('.');
    if (!splitMinutes[1]) {
        splitMinutes[1] = '000';
    } else if (splitMinutes[1].length == 1) {
        // ['1', '3'] = ['1', '300']
        splitMinutes[1] = splitMinutes[1] * 100;
    } else if (splitMinutes[1].length == 2) {
        // ['1', '32'] = ['1', '320']
        splitMinutes[1] = splitMinutes[1] * 10;
    }
    // ['1', '300'] = ['1', '18']
    splitMinutes[1] = (splitMinutes[1] / 1000) * 60;
    splitMinutes[1] = Math.round(splitMinutes[1]).toString();
    // ['1', '9'] = ['1', '09']
    if (splitMinutes[1].length == 1) {
        splitMinutes[1] = '0' + splitMinutes[1];
    }
    // ['1', '09'] = '1:09'
    var time = splitMinutes.join(':');
    return time;
}

function rmrf (location) {
    if (win) {
        var winLocation = location.split('/').join('\\');
        while (fs.existsSync(location)) {
            exec('rd /S /Q ' + winLocation);
        }
    } else {
        while (fs.existsSync(location)) {
            fs.removeSync(location);
        }
    }
}

function copy (src, dest) {
    fs.copySync(src, build + dest);
    if (lin) {
        fs.copySync(src, build32 + dest);
    }
}


// Clean build folder
rmrf(build + 'License');
rmrf(build + 'node_modules');
rmrf(build + sf);
fs.mkdirsSync(build + sf);
if (lin) {
    rmrf(build32 + 'License');
    rmrf(build32 + 'node_modules');
    rmrf(build32 + sf);
    fs.mkdirsSync(build32 + sf);
}
var timeClean = Date.now() + '';
console.log('Cleaning build folder - ' + timer(timeClean, start));


// Copy files over
fs.writeJsonSync(build + 'package.json', manifest);
if (lin) {
    fs.writeJsonSync(build32 + 'package.json', manifest);
}
copy('postinstall.js', 'postinstall.js');
copy(sf + 'index.html', sf + 'index.html');
var timeFiles = Date.now() + '';
console.log('Copying files         - ' + timer(timeFiles, timeClean));


// Copy folders over
copy('License',       'License');
copy(sf + '_fonts',   sf + '_fonts');
copy(sf + '_img',     sf + '_img');
copy(sf + '_markup',  sf + '_markup');
copy(sf + '_scripts', sf + '_scripts');
copy(sf + '_sound',   sf + '_sound');
copy(sf + '_style',   sf + '_style');
copy(sf + '_themes',  sf + '_themes');
copy(sf + 'mixins',   sf + 'mixins');
copy(sf + 'cultures', sf + 'cultures');
fs.removeSync(build + sf + 'cultures/README.md');
if (lin) {
    fs.removeSync(build32 + sf + 'cultures/README.md');
}
var timeFolder = Date.now() + '';
console.log('Copying folders       - ' + timer(timeFolder, timeFiles));


// Run executables
process.chdir(build);
exec('npm --loglevel=error install');
fs.removeSync('postinstall.js');
fs.removeSync('package-lock.json');
if (lin) {
    process.chdir('../../lin32/Scout-App');
    exec('npm --loglevel=error install');
    fs.removeSync('postinstall.js');
    fs.removeSync('package-lock.json');
}
if (darwin) {
    process.chdir('../../../../../scout-app');
} else {
    process.chdir('../../../scout-app');
}

var timeExec = Date.now() + '';
console.log('NPM Installs          - ' + timer(timeExec, timeFolder));

// Node-Sass Vendor Bindings
rmrf(build + 'node_modules/node-sass/vendor');
if (lin) {
    rmrf(build32 + 'node_modules/node-sass/vendor');
}
copy(sf + bindings + os + '-x64-43', ns + os + '-x64-43');
if (!darwin && !lin) {
    fs.copySync(sf + bindings + os + '-ia32-43', build + ns + os + '-ia32-43');
} else if (lin) {
    fs.copySync(sf + bindings + os + '-ia32-43', build32 + ns + os + '-ia32-43');
}
var timeNS = Date.now() + '';
console.log('Node-Sass bindings    - ' + timer(timeNS, timeExec));


// Zip package
var zipExe = '';
var buildInput = '';
var outputZip = '';
if (win) {
    zipExe = 'node_modules\\7zip-bin-win\\' + process.arch + '\\7za.exe';
    if (!fs.existsSync(zipExe)) {
        zipExe = 'node_modules\\7zip-bin\\' + zipExe;
    }
    buildInput = '..\\scout-app-build\\win32\\Scout-App';
    outputZip = '..\\scout-app-build\\WIN_Scout-App_' + manifest.version + '.zip';
} else if (darwin) {
    zipExe = 'node_modules/7zip-bin-mac/7za';
    buildInput = '../scout-app-build/Scout-App.app';
    outputZip = '../scout-app-build/OSX_Scout-App_' + manifest.version + '.zip';
} else if (lin) {
    zipExe = 'node_modules/7zip-bin-linux/' + process.arch + '/7za';
    buildInput = '../scout-app-build/lin64/Scout-App';
    outputZip = '../scout-app-build/LIN64_Scout-App_' + manifest.version + '.zip';
}
if ((darwin || lin) && !fs.existsSync(zipExe)) {
    zipExe = 'node_modules/7zip-bin/' + zipExe;
}
fs.removeSync(outputZip);
// a     = create archive
// -bd   = do not display a progress bar in the CLI
// -tzip = create a zip formatted file
// -mx=9 = use maximum compression
// -y    = auto answer yes to all prompts
exec(zipExe + ' a -bd -tzip -mx=9 -y ' + outputZip + ' ' + buildInput);
if (lin) {
    buildInput = '../scout-app-build/lin32/Scout-App';
    outputZip = '../scout-app-build/LIN32_Scout-App_' + manifest.version + '.zip';
    fs.removeSync(outputZip);
    exec(zipExe + ' a -bd -tzip -mx=9 -y ' + outputZip + ' ' + buildInput);
}
var timeZip = Date.now() + '';
console.log('Zipped Package        - ' + timer(timeZip, timeNS));


// Total Time
var end = Date.now() + '';
console.log('-------------------------------------');
console.log('Total Build Time      - ' + timer(end, start) + ' or ' + minutes(end, start));


// Run the app
if (win) {
    if (fs.existsSync(build + 'Scout-App.exe')) {
        exec(path.join(build, 'Scout-App.exe'));
    }
} else if (lin && process.arch == 'x64') {
    if (fs.existsSync(build + 'Scout-App')) {
        exec(build + 'Scout-App');
    }
} else if (lin && process.arch == 'ia32') {
    if (fs.existsSync(build32 + 'Scout-App')) {
        exec(build32 + 'Scout-App');
    }
} else if (darwin) {
    exec('../scout-app-build/Scout-App.app/Contents/MacOS/nwjs');
}
