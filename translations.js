// Set up ability to use myString.endsWith('.csv')
String.prototype.endsWith = function (str) {
    return this.slice(-str.length) == str;
};

var fs = require('fs-extra');
var https = require('https');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});

function createJSON () {
    var currentDirectory = fs.readdirSync('.');
    var csv = '';
    for (var i = 0; i < currentDirectory.length; i++) {
        if (currentDirectory[i].endsWith('.csv')) {
            csv = currentDirectory[i];
        }
    }

    if (csv) {
        var sheet = fs.readFileSync(csv, 'UTF-8');
        var newDictionary = {};

        converter.fromString(sheet, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            var row = {};
            for (var i = 0; i < result.length; i++) {
                row = result[i];
                for (var key in row) {
                    if (key.indexOf('note') > -1) {
                        delete row[key];
                    }
                }
                result[i] = row;
                newDictionary[result[i].KEYWORD] = result[i];
            }
            for (var key in newDictionary) {
                delete newDictionary[key].CONTEXT;
                delete newDictionary[key].KEYWORD;
            }
            var output = JSON.stringify(newDictionary, null, 2);
            fs.writeFileSync('file.json', output);
        });
    } else {
        console.log('Cannot find any CSV files');
    }
}

var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTkjAZ74inh5aFKTS2kh_-FP2hBG1MTUUYBZ_3J8MFhDR8bz6KoX8FDJg2s-_TUeoue5pCUBF2tgNSO/pub?gid=1510538720&single=true&output=csv';
var file = fs.createWriteStream('translation.csv');
var request = https.get(url, function (response) {
    response.pipe(file);
    response.on('end', function () {
        createJSON();
    });
});
