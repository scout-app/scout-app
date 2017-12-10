/* eslint-disable no-console */

var fs = require('fs-extra');
var path = require('path');
var translate = require('google-translate-api');

var input = 'Files';

var supportedLangs = [
    'ar',
    'bg',
    'da',
    'de',
    'en',
    'es',
    'fa',
    'fi',
    'fr',
    'iw',
    'hu',
    'it',
    'ja',
    'mr',
    'nl',
    'no',
    'pl',
    'pt',
    'ro',
    'ru',
    'sq',
    'tr',
    'vi',
    'zh-TW',
    'zh-CN'
];

var translations = {
    'en': input,
    'rk': input
};

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
