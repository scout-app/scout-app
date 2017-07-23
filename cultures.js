/* eslint-disable no-console */

/*
  This file downloads the latest copy of the translations as a CSV.
  It then saves that CSV to the cultures folder, reads it, and converts
  it to JSON. The JSON is processed removing "Notes" columns and languages
  that are not fully translated yet (See: line 15). Then we reshape the
  data so that we have an object with sub-objects named after the KEYWORDS.
  Each KEY objects contains KEY/VALUE pairs of culture codes and phrases
  (See: scout-files/cultures/dictionary.json).
*/


// An array of culture codes that are not finished and should not be in the app yet (such as 'fa', 'de')
var languagesToSkip = [];



var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var csv = require('csvtojson');
var data = [];
var url = 'https://docs.google.com/spreadsheets/d/e/' +
          '2PACX-1vTkjAZ74inh5aFKTS2kh_-FP2hBG1MTUUYBZ_3J8MFhDR8bz6KoX8FDJg2s-_TUeoue5pCUBF2tgNSO/' +
          'pub?gid=1510538720&single=true&output=csv';
var folder = path.join(process.cwd(), 'scout-files/cultures/');

function sortCultureCodes (unordered) {
    var ordered = {};
    Object.keys(unordered).sort().forEach(function (key) {
        ordered[key] = unordered[key];
    });
    return ordered;
}

function createJSON (result) {
    // Remove "Notes" columns
    var row = {};
    var i = 0;
    var key = '';
    var newDictionary = {};

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

    // Remove CONTEXT, KEYWORD, and unfinished translation columns
    for (key in newDictionary) {
        delete newDictionary[key].CONTEXT;
        delete newDictionary[key].KEYWORD;
        for (i = 0; i < languagesToSkip.length; i++) {
            delete newDictionary[key][languagesToSkip[i]];
        }
    }

    // Alphabetize list of cultures in each KEYWORD
    for (key in newDictionary) {
        newDictionary[key] = sortCultureCodes(newDictionary[key]);
    }

    // Convert to a string with an empty line at the end
    var output = JSON.stringify(newDictionary, null, 2);
    output = output.split('\r\n').join('\n');
    output = output.split('\n\r').join('\n');
    output = output.split('\r').join('\n');
    output = output.split('\n').join('\r\n');
    output = output + '\r\n';

    // Save the file
    var dictionaryPath = path.join(folder, 'dictionary.json');
    fs.writeFileSync(dictionaryPath, output);
    console.log('Updated: ', dictionaryPath);
}

csv()
    .fromStream(request.get(url))
    .on('json', function (jsonObj) {
        data.push(jsonObj);
    })
    .on('done', function (error) {
        if (error) {
            console.log(error);
        } else {
            createJSON(data);
        }
    });
