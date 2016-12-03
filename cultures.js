/* eslint-disable no-console */

var fs = require('fs-extra');
var path = require('path');
var https = require('https');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});
var url = 'https://docs.google.com/spreadsheets/d/e/' +
          '2PACX-1vTkjAZ74inh5aFKTS2kh_-FP2hBG1MTUUYBZ_3J8MFhDR8bz6KoX8FDJg2s-_TUeoue5pCUBF2tgNSO/' +
          'pub?gid=1510538720&single=true&output=csv';
var folder = 'scout-files/cultures/';
var csv = path.join(folder, 'translation.csv');
var file = fs.createWriteStream(csv);

var languagesToSkip = ['de', 'fa'];

function createJSON () {
    var sheet = fs.readFileSync(csv, 'UTF-8');
    var newDictionary = {};
    var i = 0;
    var key = '';

    converter.fromString(sheet, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var row = {};
        for (i = 0; i < result.length; i++) {
            row = result[i];
            for (key in row) {
                if (key.indexOf('note') > -1) {
                    delete row[key];
                }
            }
            result[i] = row;
            newDictionary[result[i].KEYWORD] = result[i];
        }
        for (key in newDictionary) {
            delete newDictionary[key].CONTEXT;
            delete newDictionary[key].KEYWORD;
            for (i = 0; i < languagesToSkip.length; i++) {
                delete newDictionary[key][languagesToSkip[i]];
            }
        }
        var output = JSON.stringify(newDictionary, null, 2);
        fs.writeFileSync(path.join(folder, 'dictionary.json'), output);
    });
}

https.get(url, function (response) {
    response.pipe(file);
    response.on('end', function () {
        createJSON();
    });
});
