
/*
  When you run node-sass on a project, we output status messages
  and error alerts as green and red panels using these functions.
*/

(function ($, scout, ugui) {

    function playAlert () {
        var alert = new Audio('_sound/scout-alert.wav');
        alert.play();
    }

    function playMessage () {
        var message = new Audio('_sound/scout-message.wav');
        message.play();
    }

    function desktopNotification (file, bodyText, alertOrMessage) {
        var randNum = Math.round(Math.random() * 10000);
        scout.helpers[alertOrMessage].notification[randNum] = new Notification(file, {
            icon: '_img/logo_32.png',
            body: bodyText
        });

        scout.helpers[alertOrMessage].notification[randNum].onclick = function () {
            $('#viewStatus').click();
            var win = require('nw.gui').Window.get();
            win.show();
            win.focus();
        };

        scout.helpers[alertOrMessage].notification[randNum].onshow = function () {
            // auto close after 1 second
            setTimeout(function () {
                scout.helpers[alertOrMessage].notification[randNum].close();
            }, 3000);
        };
    }

    function alert (error, projectID) {
        if (scout.globalSettings.alertSound) {
            playAlert();
        }

        if ($('#project-settings').is(':visible')) {
            var id = $('#projectID').val();
            $('#sidebar .' + id).click();
        }

        projectID = projectID || 'sa0';
        for (var i = 0; i < scout.projects.length;i++) {
            if (scout.projects[i].projectID === projectID) {
                var projectName = scout.projects[i].projectName;
                break;
            }
        }

        var path = require('path');
        var file = error.file;
        var bugLine = error.line;
        var col = error.column;
        var code = error.status;
        var time = new Date().timeNow();
        var title = scout.localize('ALERT_TITLE');
        title = title.replace('{{time}}', time).replace('{{code}}', code).replace('{{bugLine}}', bugLine).replace('{{col}}', col);
        var footer = '<em>' + file + '</em>';
        var bugFile = path.basename(file);

        var fileContents = ugui.helpers.readAFile(file);
        fileContents = fileContents.split('\n');
        var count = fileContents.length;

        var theError = '<span class="num">' + bugLine + ':</span> <span class="text-primary">' + fileContents[(bugLine - 1)] + '</span>';
        var errorPreview = theError;
        // Replace tabbed returns with bullet points, and regular returns with <BR>'s
        var errorMessage = error.message
            .replace(/[\r,\n]\s\s/g, '<br /><span class="bullet"></span>')
            .replace(/[\n\r]/g, '<br />')
            .replace(file, '');

        // Make sure there are at least 3 lines in the file and the error isn't on the first or last line
        if (count > 3 && (bugLine - 1) !== 0 && (bugLine) !== count) {
            errorPreview =
              // line before the error
              '<span class="num">' + (bugLine - 1) + ':</span> ' + fileContents[(bugLine - 2)] + '\n' +
              theError +
              // line after the error
              '<span class="num">' + (bugLine + 1) + ':</span> ' + fileContents[bugLine];
        }

        var formmatedError =
            '<div class="panel panel-primary ' + projectID + '" title="' + projectName + '">' +
              '<div class="panel-heading">' +
                '<span class="pull-right glyphicon glyphicon-remove"></span>' +
                '<h3 class="panel-title">' + title + '</h3>' +
              '</div>' +
              '<div class="panel-body">' +
                errorMessage + '<br />' +
                '<strong>' + bugFile + '</strong><br />' +
                '<pre>' +
                  '<code>' +
                    errorPreview +
                  '</code>' +
                '</pre>' +
              '</div>' +
              '<div class="panel-footer">' +
                footer +
              '</div>' +
            '</div>';

        if (scout.globalSettings.alertInApp) {
            $('#printConsole').prepend(formmatedError);
        }

        $('#printConsole .panel .glyphicon-remove').click(function () {
            $(this).parent().parent().remove();
        });

        $('#sidebar .active').click();

        if (scout.globalSettings.alertDesktop) {
            var lineAndCol = title.split(') - ')[1];
            lineAndCol = lineAndCol.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
            desktopNotification(bugFile, lineAndCol, 'alert');
        }
    }

    function warn (error, projectID) {
        if (scout.globalSettings.alertSound) {
            playAlert();
        }

        if ($('#project-settings').is(':visible')) {
            var id = $('#projectID').val();
            $('#sidebar .' + id).click();
        }

        projectID = projectID || 'sa0';
        for (var i = 0; i < scout.projects.length;i++) {
            if (scout.projects[i].projectID === projectID) {
                var projectName = scout.projects[i].projectName;
                break;
            }
        }

        var path = require('path');
        var file = error.file || error.folder;
        var bugLine = error.line;
        var col = error.column;
        var code = error.status;
        var time = new Date().timeNow();
        var title = scout.localize('ALERT_TITLE');
        title = title
            .replace('{{time}}', time)
            .replace('{{code}}', code)
            .replace('{{bugLine}}', bugLine)
            .replace('{{col}}', col);
        var footer = '<em>' + file + '</em>';
        var bugFile = path.basename(file);
        var errorMessage = error.message
            .replace(/[\r,\n]\s\s/g, '<br /><span class="bullet"></span>')
            .replace(/[\n\r]/g, '<br />')
            .replace(file, '');

        var formmatedError =
            '<div class="panel panel-warning ' + projectID + '" title="' + projectName + '">' +
              '<div class="panel-heading">' +
                '<span class="pull-right glyphicon glyphicon-remove"></span>' +
                '<h3 class="panel-title">' + title + '</h3>' +
              '</div>' +
              '<div class="panel-body">' +
                errorMessage + '<br />' +
                '<strong><span class="bullet"></span>' + bugFile + '</strong><br />' +
              '</div>' +
              '<div class="panel-footer">' +
                footer +
              '</div>' +
            '</div>';

        if (scout.globalSettings.alertInApp) {
            $('#printConsole').prepend(formmatedError);
        }

        $('#printConsole .panel .glyphicon-remove').click(function () {
            $(this).parent().parent().remove();
        });

        $('#sidebar .active').click();

        if (scout.globalSettings.alertDesktop) {
            var lineAndCol = title.split(') - ')[1];
            lineAndCol = lineAndCol.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
            desktopNotification(bugFile, lineAndCol, 'alert');
        }
    }

    function message (message, projectID) {
        if (scout.globalSettings.messageSound) {
            playMessage();
        }
        if ($('#project-settings').is(':visible')) {
            var id = $('#projectID').val();
            $('#sidebar .' + id).click();
        }

        projectID = projectID || 'sa0';
        for (var i = 0; i < scout.projects.length;i++) {
            if (scout.projects[i].projectID === projectID) {
                var projectName = scout.projects[i].projectName;
                break;
            }
        }

        var folderPathSplit = message.stats.entry.split('\\').join('/').split('/');
        var folderAndFile = folderPathSplit[folderPathSplit.length - 2] + '\\' + folderPathSplit[folderPathSplit.length - 1];
        var time = new Date().timeNow();
        var duration = message.stats.duration + scout.localize('MILLISECONDS_SHORT');
        if (message.stats.duration > 499) {
            duration = (Math.round(message.stats.duration / 100) / 10) + ' ' + scout.localize('SECONDS');
        }

        var processedTime = scout.localize('PROCESSED_IN_DURATION') ;
        processedTime = projectName + ' | ' + processedTime.replace('{{duration}}', duration);
        var formattedMessage =
        '<div class="alert alert-success ' + projectID + '" role="alert" title="' + processedTime + '">' +
          '<strong>' + time + '</strong> ' +
          folderAndFile +
          '<span class="pull-right glyphicon glyphicon-remove"></span>' +
        '</div>';

        if (scout.globalSettings.messageInApp) {
            $('#printConsole').prepend(formattedMessage);
        }

        $('#printConsole .alert .glyphicon-remove').click(function () {
            $(this).parent().remove();
        });

        $('#sidebar .active').click();

        if (scout.globalSettings.messageDesktop) {
            var path = require('path');
            var file = path.basename(message.stats.entry);
            desktopNotification(file, processedTime, 'message');
        }
    }

    $('[data-argName="messageSound"]').click(playMessage);
    $('[data-argName="alertSound"]').click(playAlert);

    scout.helpers.alert = alert;
    scout.helpers.warn = warn;
    scout.helpers.message = message;
    scout.helpers.alert.notification = {};
    scout.helpers.warn.notification = {};
    scout.helpers.message.notification = {};

})(window.$, window.scout, window.ugui);
