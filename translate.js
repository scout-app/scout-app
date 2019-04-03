/* eslint-disable no-console */

// Translate one phrase into a bunch of languages

// SETTINGS

var input = 'Phrase to be translated.';
var supportedLangs = [
    'ar', // arabic
    'bg', // bulgarian
    'da', // danish
    'de', // german
    'en', // english
    'es', // spanish/argentina
    'fa', // farsi/persian
    'fi', // finnish
    'fr', // french
    'iw', // hebrew
    'hu', // hungarian
    'id', // indonesian
    'it', // italian
    'ja', // japanese
    'mr', // marathi
    'nl', // dutch
    'no', // norwegian
    'pl', // polish
    'pt', // brazilian portuguese
    'ro', // romanian
    'ru', // russian
    'sq', // albanian
    'sv', // swedish
    'ta', // tamil
    'tr', // turkish
    'uk', // ukranian
    'vi', // vietnamese
    'zh-TW', // chinese traditional
    'zh-CN' // chinese simplified
];
var translations = {
    'en': input, // english
    'rk': input // redneck
};










// CODE

var fs = require('fs-extra');
var path = require('path');
var translate = require('google-translate-api');

function saveFile () {
    var file = path.join('.', 'translated.txt');
    var sorted = JSON.stringify(translations, Object.keys(translations).sort(), 2);
    var data = sorted + '\n';

    fs.writeFileSync(file, data);
}

var total = 0;

supportedLangs.forEach(function (lang) {
    var settings = {
        from: 'en',
        to: lang
    };
    translate(input, settings).then(function (response) {
        var translation = response.text;

        if (lang === 'es') {
            translations['es'] = translation;
            translations['es-ar'] = translation;
        } else if (lang === 'zh-TW') {
            translations['zh-cht'] = translation;
        } else if (lang === 'zh-CN') {
            translations['zh-cn'] = translation;
        } else if (lang === 'pt') {
            translations['pt-br'] = translation;
        } else if (lang === 'iw') {
            translations['he'] = translation;
        } else {
            translations[lang] = translation;
        }

        total = total + 1;
        if (total == supportedLangs.length) {
            saveFile();
        }
    }.bind(this)).catch(function (err) {
        console.log('==================================');
        console.error(err);

        total = total + 1;
        if (total == supportedLangs.length) {
            saveFile();
        }
    }.bind(this));
});
