/* eslint-disable no-console */

/*
  This file downloads the latest copy of the translations as a CSV.
  It then converts it to JSON. The JSON is processed removing "Notes"
  columns and languages that are not fully translated yet (See: line 14).
  We then reshape the data so that we have an object with sub-objects
  named after each culture-code. Each culture sub-object contains
  KEY/VALUE pairs of KEYWORD and phrase. Finally each culture code is
  saved to it's own JSON file. See: scout-files/cultures/*.json
*/


// An array of culture codes that are not finished and should not be in the app yet (such as 'fa', 'de')
var languagesToSkip = [
    'pt-br2',
    'tr2'
];



var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var csv = require('csvtojson');
var data = [];
var url = 'https://docs.google.com/spreadsheets/d/e/' +
          '2PACX-1vTkjAZ74inh5aFKTS2kh_-FP2hBG1MTUUYBZ_3J8MFhDR8bz6KoX8FDJg2s-_TUeoue5pCUBF2tgNSO/' +
          'pub?gid=1510538720&single=true&output=csv';
var folder = path.join(process.cwd(), 'scout-files/cultures/');

// generic helper function
function sortObjectKeys (unordered) {
    var ordered = {};
    Object.keys(unordered).sort().forEach(function (key) {
        ordered[key] = unordered[key];
    });
    return ordered;
}

/*
    result = [
        { KEYWORD: 'ABOUT', CONTEXT: '', en: 'About', fr: 'Avec', fr-notes: 'a note' },
        { KEYWORD: 'THE',   CONTEXT: '', en: 'The',   fr: 'Le',   fr-notes: 'words'  }
    ]
    =>
    result = [
        { KEYWORD: 'ABOUT', en: 'About', fr: 'Avec' },
        { KEYWORD: 'THE',   en: 'The',   fr: 'Le'   }
    ]
*/
function removeNotesAndContextColumns (result) {
    for (var i = 0; i < result.length; i++) {
        var row = result[i];
        for (var key in row) {
            if (key.includes('note') || key === 'CONTEXT') {
                delete row[key];
            }
        }
        result[i] = row;
    }
    return result;
}

// Remove unfinished translation columns (based on languagesToSkip)
function removeUnfinishedLangs (result) {
    for (var j = 0; j < result.length; j++) {
        var row = result[j];
        for (var i = 0; i < languagesToSkip.length; i++) {
            var langToSkip = languagesToSkip[i];
            delete row[langToSkip];
        }
    }
    return result;
}

/*
    result = [
        { KEYWORD: 'ABOUT', en: 'About', fr: 'Avec' },
        { KEYWORD: 'THE',   en: 'The',   fr: 'Le'   }
    ]
    =>
    volumeOfDictionaries = {
        en: { ABOUT: 'About', THE: 'The' },
        fr: { ABOUT: 'Avec',  THE: 'Le'  }
    }
*/
function createLanguageDictionaries (result) {
    var volumeOfDictionaries = {};
    for (var i = 0; i < result.length; i++) {
        var row = result[i];
        for (var key in row) {
            var keyword = row.KEYWORD;
            var translation = row[key];
            if (!volumeOfDictionaries[key]) {
                volumeOfDictionaries[key] = {};
            }
            volumeOfDictionaries[key][keyword] = translation;
        }
    }
    delete volumeOfDictionaries.KEYWORD;
    return volumeOfDictionaries;
}

// Alphabetize list of keywords in each culture
function sortKeywords (volumeOfDictionaries) {
    for (var culture in volumeOfDictionaries) {
        var dictionary = volumeOfDictionaries[culture];
        var sortedDictionary = sortObjectKeys(dictionary);
        volumeOfDictionaries[culture] = sortedDictionary;
    }
    return volumeOfDictionaries;
}

// Convert to a string with an empty line at the end
function convertDictionarytoString (dictionary) {
    var output = JSON.stringify(dictionary, null, 2);
    output = output.split('\r\n').join('\n');
    output = output.split('\n\r').join('\n');
    output = output.split('\r').join('\n');
    output = output.split('\n').join('\r\n');
    output = output + '\r\n';
    return output;
}

/*
    volumeOfDictionaries: {
        en: { ABOUT: 'About', THE: 'the' },
        fr: { ABOUT: 'Avec',  THE: 'le'  }
    }
    =>
    en.json = { ABOUT: 'About', THE: 'the' }
    fr.json = { ABOUT: 'Avec',  THE: 'le'  }
*/
function saveIndividualDictionaries (volumeOfDictionaries) {
    for (var lang in volumeOfDictionaries) {
        var dictionary = volumeOfDictionaries[lang];
        var dictionaryPath = path.join(folder, lang + '.json');
        var output = convertDictionarytoString(dictionary);
        try {
            fs.writeFileSync(dictionaryPath, output);
        } catch (err) {
            console.log(err);
            console.log('Error saving file ' + lang + '.json');
        }
        console.log('Updated: ' + lang + '.json');
    }
}

csv()
    .fromStream(request.get(url))
    .on('json', function (jsonObj) {
        // Each row of the CSV is an object pushed to an array
        // [ { keyword: ABOUT, en: About, fr: Avec }, { keyword: THE, en: The, fr: Le } ]
        data.push(jsonObj);
    })
    .on('done', function (error) {
        if (error) {
            console.log(error);
        } else {
            data = removeNotesAndContextColumns(data);
            data = removeUnfinishedLangs(data);
            var volumeOfDictionaries = createLanguageDictionaries(data);
            volumeOfDictionaries = sortKeywords(volumeOfDictionaries);
            saveIndividualDictionaries(volumeOfDictionaries);
        }
    });
