//BUILDING FOR WINDOWS:

//This assumes you have a folder next to `scout-app` called `scout-app-build`.
//`scout-app-build` folder should contain:
//  * locales (folder)
//  * icudtl.dat
//  * nw.pak
//  * Scout-App.exe
// All of those are from NW.js 0.12.3, the .exe is a renamed version of
// nw.exe with a custom icon



// Variables
var fs = require('fs-extra');
var rimraf = require('rimraf'); // rimraf used to set number of retries for deleting files in use
//var del = require('del'); // del used to delete entire folders with the exception of specific files
var manifest = fs.readJsonSync('package.json');
manifest.devDependencies = {};
console.log(manifest);
var o = '../scout-app-build/';
var s = 'scout-files/';

// Clean build folder
console.log('cleaning build folder');
if (fs.existsSync(o + 'License'))          { fs.removeSync(o + 'License')          }
if (fs.existsSync(o + 'bower_components')) { fs.removeSync(o + 'bower_components') }
if (fs.existsSync(o + 'node_modules'))     { fs.removeSync(o + 'node_modules')     }
if (fs.existsSync(o + s))                  { fs.removeSync(o + s)                  }
fs.mkdirsSync(o + s);

// Copy files over
console.log('copying files');
fs.writeJsonSync(o + 'package.json', manifest);
fs.copySync('bower.json',     o + 'bower.json');
fs.copySync(s + 'index.html', o + s + 'index.html');

// Copy folders over
console.log('copying folders');
fs.copySync('License',        o + 'License');
fs.copySync(s + '_fonts',     o + s + '_fonts');
fs.copySync(s + '_img',       o + s + '_img');
fs.copySync(s + '_markup',    o + s + '_markup');
fs.copySync(s + '_scripts',   o + s + '_scripts');
fs.copySync(s + '_style',     o + s + '_style');
fs.copySync(s + '_themes',    o + s + '_themes');
fs.copySync(s + 'mixins',     o + s + 'mixins');
fs.copySync(s + 'cultures',   o + s + 'cultures');
fs.removeSync(o + s + 'cultures/cultures.xls');
fs.removeSync(o + s + 'cultures/README.md');

// Run executables
// var exec = require("child_process").execSync;
// exec('npm --prefix ../scout-app-build install --production ../scout-app-build');

