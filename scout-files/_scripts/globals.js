
/*
  Global stuff
*/

// Create the global Scout object
window.scout = {
    'ftux': {},
    'globalSettings': {
        'cultureCode': 'en',
        'alertDesktop': true,
        'alertInApp': true,
        'alertSound': true,
        'messageDesktop': false,
        'messageInApp': true,
        'messageSound': true,
        'sendToTrayOnClose': true,
        'startMinimized': false,
        'automaticUpdates': true
    },
    'helpers': {},
    'projects': [],
    'versions': {
        'nodeSass': '',
        'libSass': '',
        'scout': window.ugui.app.version
    },
    'dictionary': {}
};

// Format time as 03:14:15 PM
Date.prototype.timeNow = function () {
    var hour = this.getHours();
    var second = this.getSeconds();
    var minute = this.getMinutes();

    var amPM = 'AM';

    var leadingZeroHour = '';
    var leadingZeroMinute = '';
    var leadingZeroSeconds = '';

    if (this.getHours() > 12) {
        hour = this.getHours() - 12;
        amPM = 'PM';
    }
    if (this.getHours() < 10) {
        leadingZeroHour = '0';
    }
    if (this.getMinutes() < 10) {
        leadingZeroMinute = '0';
    }
    if (this.getSeconds() < 10) {
        leadingZeroSeconds = '0';
    }
    var time =
      leadingZeroHour + hour + ':' +
      leadingZeroMinute + minute + ':' +
      leadingZeroSeconds + second + ' ' + amPM;
    return time;
};

// Set up ability to use myString.startsWith('asdf')
String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};

// Set up ability to use myString.endsWith('asdf')
String.prototype.endsWith = function (str) {
    return this.slice(-str.length) == str;
};

// Move stuff around in Arrays
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

/**
 * Remove an Item From an Array
 * by passing in the index of that item
 *
 * @param  {number}   itemToRemove   Zero-based index of the place in the array of the item to remove
 */
Array.prototype.remove = function (itemToRemove) {
    this.splice(itemToRemove, 1);
};
