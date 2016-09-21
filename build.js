//BUILDING FOR WINDOWS/LINUX:

//Prerequisites: Must have Node, NPM, and Bower installed globally.
//This assumes you have a folder next to `scout-app` called `scout-app-build`.
//`scout-app-build` folder should contain:
//  * locales (folder)
//  * icudtl.dat
//  * nw.pak
//  * Scout-App.exe
// All of those are from NW.js 0.12.3, the .exe is a renamed version of
// nw.exe with a custom icon


// Variables
var start = Date.now() + '';
var os = process.platform;
var win = false;
var lin = false;
var darwin = false;
if (os == 'win32' ) { win = true; }
if (os == 'linux' ) { lin = true; }
if (os == 'darwin') { darwin = true; }
if (os == 'freebsd' || os == 'sunos' || ( os != 'win32' && os != 'linux' && os != 'darwin' ) ) {
    lin = true;
    console.log('UNSUPPORTED OPERATING SYSTEM')
    console.log('Build will probably fail.');
}
var fs = require('fs-extra');
var ZipZipTop = require("zip-zip-top");
var exec = require('child_process').execSync;
//var rimraf = require('rimraf'); // used to set number of retries for async deleting of in use files
//var del = require('del'); // used to delete entire folders with the exception of specific files
var manifest = fs.readJsonSync('package.json');
manifest.name = manifest.name.toLowerCase();
delete manifest.devDependencies;
if (lin) { manifest.window.icon = 'scout-files/_img/logo_128.png'; }
var bowerJSON = fs.readJsonSync('bower.json');
bowerJSON.name = bowerJSON.name.toLowerCase();
var build = '../scout-app-build/';
var sf = 'scout-files/';
var bindings = '_assets/node-sass_v3.4.2/';
var ns = 'node_modules/node-sass/vendor/';

// Functions
function timer (finish, begin) {
    //3195
    var subtract = finish - begin;
    //319.5 becomes 320
    var round = Math.round(subtract / 10);
    //320 becomes 3.2
    var seconds = round / 100;
    //3.2 becomes ['3', '2']
    var splitSeconds = seconds.toString().split('.');
    if (splitSeconds[0].length < 2) {
        //'3' becomes ' 3'
        splitSeconds[0] = ' ' + splitSeconds[0];
    }
    if (splitSeconds.length == 1 || splitSeconds[1].length < 1) {
        //'' becomes '00'
        splitSeconds[1] = '00';
    } else if (splitSeconds[1].length == 1) {
        //'2' becomes '20'
        splitSeconds[1] = splitSeconds[1] + '0';
    }
    if (splitSeconds[0].length == 3) {
        splitSeconds[1] = splitSeconds[1][0];
    }
    //[' 3', '20'] becomes ' 3.20 seconds'
    var time = splitSeconds.join('.') + ' seconds';
    return time;
}

function minutes (finish, begin) {
    //82500
    var subtract = finish - begin;
    //82500 = 1.375
    var minutes = subtract / 60000;
    minutes = Math.round(minutes * 1000) / 1000;
    //1.375 = ['1', '375']
    var splitMinutes = minutes.toString().split('.');
    if (!splitMinutes[1]) {
        splitMinutes[1] = '000';
    } else if (splitMinutes[1].length == 1) {
        //['1', '3'] = ['1', '300']
        splitMinutes[1] = splitMinutes[1] * 100;
    } else if (splitMinutes[1].length == 2) {
        //['1', '32'] = ['1', '320']
        splitMinutes[1] = splitMinutes[1] * 10;
    }
    //['1', '300'] = ['1', '18']
    splitMinutes[1] = (splitMinutes[1] / 1000) * 60;
    splitMinutes[1] = Math.round(splitMinutes[1]).toString();
    //['1', '9'] = ['1', '09']
    if (splitMinutes[1].length == 1) {
        splitMinutes[1] = '0' + splitMinutes[1];
    }
    //['1', '09'] = '1:09'
    var time = splitMinutes.join(':');
    return time;
}

function rmrf (location) {
    if (win) {
        var winLocation = location.split('/').join('\\');
        while ( fs.existsSync(location) ) {
            exec('rd /S /Q ' + winLocation);
        }
    } else {
        while ( fs.existsSync(location) ) {
            fs.removeSync(location);
        }
    }
}


// Clean build folder
rmrf(build + 'License');
rmrf(build + 'bower_components');
rmrf(build + 'node_modules');
rmrf(build + 'temp');
rmrf(build + sf);
fs.mkdirsSync(build + sf);
var timeClean = Date.now() + '';
console.log('Cleaning build folder - ' + timer(timeClean, start));


// Copy files over
fs.writeJsonSync(build + 'package.json', manifest);
fs.writeJsonSync(build + 'bower.json', bowerJSON);;
fs.copySync(sf + 'index.html', build + sf + 'index.html');
var timeFiles = Date.now() + '';
console.log('Copying files         - ' + timer(timeFiles, timeClean));


// Copy folders over
fs.copySync('License',        build + 'License');
fs.copySync(sf + '_fonts',    build + sf + '_fonts');
fs.copySync(sf + '_img',      build + sf + '_img');
fs.copySync(sf + '_markup',   build + sf + '_markup');
fs.copySync(sf + '_scripts',  build + sf + '_scripts');
fs.copySync(sf + '_style',    build + sf + '_style');
fs.copySync(sf + '_themes',   build + sf + '_themes');
fs.copySync(sf + 'mixins',    build + sf + 'mixins');
fs.copySync(sf + 'cultures',  build + sf + 'cultures');
fs.removeSync(build + sf + 'cultures/cultures.xls');
fs.removeSync(build + sf + 'cultures/README.md');
var timeFolder = Date.now() + '';
console.log('Copying folders       - ' + timer(timeFolder, timeFiles));


// Run executables
if (win) {
    exec('npm --loglevel=error --prefix ' + build + 'temp install ' + build);
} else {
    exec('npm --loglevel=error --prefix ' + build + 'temp install ' + build);
}
var timeExec = Date.now() + '';
console.log('NPM & Bower Installs  - ' + timer(timeExec, timeFolder));


// Move bower_components into place and clean
fs.copySync(build + 'temp/node_modules/scout-app/bower_components', build + 'bower_components');
var timeBower = Date.now() + '';
console.log('Move bower_components - ' + timer(timeBower, timeExec));
if (!win) {
    rmrf(build + 'temp/node_modules/scout-app');
    var timeBowerDel = Date.now() + '';
    console.log('Del bower_components  - ' + timer(timeBowerDel, timeBower));
}


// Move node_modules into place and clean
if (win) {
    fs.copySync(build + 'temp/node_modules/scout-app/node_modules', build + 'node_modules');
} else {
    fs.copySync(build + 'temp/node_modules', build + 'node_modules');
}
var timeNM = Date.now() + '';
if (win) {
    console.log('Move node_modules     - ' + timer(timeNM, timeBower));
} else {
    console.log('Move node_modules     - ' + timer(timeNM, timeBowerDel));
}

rmrf(build + 'temp');
var timeRmvTmp = Date.now() + '';
console.log('Delete Temp           - ' + timer(timeRmvTmp, timeNM));


// Node-Sass Vendor Bindings
rmrf(build + 'node_modules/node-sass/vendor');
if (win) {
    fs.copySync(sf + bindings + 'win32-ia32-43', build + ns + 'win32-ia32-43');
    fs.copySync(sf + bindings + 'win32-x64-43',  build + ns + 'win32-x64-43');
} else if (os == 'freebsd') {
    fs.copySync(sf + bindings + 'freebsd-ia32-43', build + ns + 'freebsd-ia32-43');
    fs.copySync(sf + bindings + 'freebsd-x64-43',  build + ns + 'freebsd-x64-43');
} else if (darwin) {
    fs.copySync(sf + bindings + 'darwin-x64-43',  build + ns + 'darwin-x64-43');
} else if (lin) {
    fs.copySync(sf + bindings + 'linux-ia32-43', build + ns + 'linux-ia32-43');
    fs.copySync(sf + bindings + 'linux-x64-43',  build + ns + 'linux-x64-43');
}
var timeNS = Date.now() + '';
console.log('Node-Sass bindings    - ' + timer(timeNS, timeNM));


// Zip package
var zipBuild = new ZipZipTop();
var zipOptions = { 'rootFolder': 'newRootFolder' };
zipBuild.zipFolder('../scout-app-build', function () {
    if (err) { console.log(err); }
    var osTitle = '';
    if (os == 'win32')   { osTitle = 'WIN'; } else
    if (os == 'darwin')  { osTitle = 'OSX'; } else
    if (os == 'freebsd') { osTitle = 'BSD'; } else
    if (os == 'sunos')   { osTitle = 'SUN'; } else
    if (os == 'linux')   { osTitle = 'LIN64'; }
    var filename = '../' + osTitle + '_Scout-App_' + manifest.version + '.zip';
    zipBuild.writeToFile(filename, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Done');
    });
}, zipOptions);
if (lin) {
    var zipBuild32 = new ZipZipTop();
    zipBuild32.zipFolder('../scout-app-build-32', function () {
        if (err) { console.log(err); }
        var filename32 = '../LIN32_Scout-App_' + manifest.version + '.zip';
        zipBuild32.writeToFile(filename32, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Done');
        });
    }, zipOptions);
}
var timeZip = Date.now() + '';
console.log('Node-Sass bindings    - ' + timer(timeZip, timeNS));


// Total Time
var end = Date.now() + '';
console.log('-------------------------------------');
console.log('Total Build Time      - ' + timer(end, start) + ' or ' + minutes(end, start));


//Run the app
if (win) {
    if ( fs.existsSync(build + 'Scout-App.exe') ) {
        exec(build.split('/').join('\\') + 'Scout-App.exe');
    }
} else if (darwin) {
    //????
} else {
    if ( fs.existsSync(build + 'Scout-App') ) {
        exec(build + 'Scout-App');
    }
}
