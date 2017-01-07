var lint = require('sass-lint');

var results = lint.lintFiles('', {}, '.sass-lint.yml');
var hr = '--------------------------------------------------------------------';
var result = '';
var file = '';
var messages = '';
var message = '';
var location = '';
var output = '';
var msg = '';
var rule = '';
var line = '';
var col = '';
var len = 0;
var msgCount = 0;

for (var i = 0; i < results.length; i++) {
    result = results[i];
    file = result.filePath;
    messages = result.messages;
    if (messages.length > 0) {
        console.log(hr);
        console.log(file);
        for (var j = 0; j < messages.length; j++) {
            msgCount = msgCount + 1;
            message = messages[j];
            msg = message.message;
            rule = ' (' + message.ruleId + ')';
            line = message.line + '';
            col = message.column + '';

            if (line.length == 1) {
                line = '   ' + line;
            } else if (line.length == 2) {
                line = '  ' + line;
            } else if (line.length == 3) {
                line = ' ' + line;
            }

            if (col.length == 1) {
                col = col + '  ';
            } else if (col.length == 2) {
                col = col + ' ';
            }

            len = 48 - msg.length;
            if (len > 0) {
                msg = msg + new Array(len + 1).join(' ');
            }
            // Some messages are predictably short, so we can remove spaces so the lint rule will fit on the same line
            if (msg == 'Space expected between blocks                   ') {
                msg = 'Space expected between blocks             ';
            } else if (msg == 'Space expected around operator                  ') {
                msg = 'Space expected around operator                ';
            } else if (msg == 'Selectors must be placed on new lines           ') {
                msg = 'Selectors must be placed on new lines      ';
            }

            location = line + ':' + col + ' ';
            output = location + msg + rule;
            console.log(output);
        }
        console.log(file);
    }
    if (i == results.length - 1) {
        console.log(hr);
    }
}

if (msgCount > 0) {
    console.log('Total: ' + msgCount);
} else {
    console.log('Sass Lint Passed');
}
