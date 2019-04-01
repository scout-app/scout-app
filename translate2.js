/* eslint-disable no-console */

// Translate a bunch of phrases into one language.


// SETTINGS

var inputs = {
    'VIEW_LATEST_RELEASE': 'View latest release',
    'WELCOME_MESSAGE': 'Welcome to Scout-App!',
    'WINDOW_SETTING': 'Window'
};

var translateFrom = 'en';
var translateTo = 'id';






// CODE

var fs = require('fs-extra');
var path = require('path');
var translate = require('google-translate-api');

var total = 0;
var totalLength = Object.keys(inputs).length;
var inputsArray = Object.entries(inputs);
var translations = {};

function saveFile () {
    var file = path.join('.', 'translated.txt');
    var sorted = JSON.stringify(translations, Object.keys(translations).sort(), 2);
    var data = sorted + '\n';

    fs.writeFileSync(file, data);
}

inputsArray.forEach(function (input) {
    var key = input[0];
    var phrase = input[1];
    var settings = {
        from: translateFrom,
        to: translateTo
    };
    if (phrase === '.') {
        translations[key] = '.';
        total = total + 1;
        if (total == totalLength) {
            saveFile();
        }
    } else {
        translate(phrase, settings).then(function (response) {
            var translation = response.text;

            translations[key] = translation;

            total = total + 1;
            if (total == totalLength) {
                saveFile();
            }
        }.bind(this)).catch(function (err) {
            console.log('==================================');
            console.error(err);

            total = total + 1;
            if (total == totalLength) {
                saveFile();
            }
        }.bind(this));
    }
});
