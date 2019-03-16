/* eslint-disable no-multi-spaces */

/*
  App-wide preference controls. Language settings, Theme ,etc.
*/

(function ($, scout, ugui, Slider) {

    $('#preferences').click(function () {
        $('#preferences-modal').fadeIn();
    });

    $('[data-argName=alertInApp], ' +
      '[data-argName=alertSound], ' +
      '[data-argName=alertDesktop], ' +
      '[data-argName=messageInApp], ' +
      '[data-argName=messageSound], ' +
      '[data-argName=messageDesktop],' +
      '[data-argName=sendToTrayOnClose],' +
      '[data-argName=startMinimized],' +
      '[data-argName=automaticUpdates]'
    ).prop('checked', false);

    if (scout.globalSettings.alertInApp)        { $('[data-argName=alertInApp]').prop('checked', true);        }
    if (scout.globalSettings.alertSound)        { $('[data-argName=alertSound]').prop('checked', true);        }
    if (scout.globalSettings.alertDesktop)      { $('[data-argName=alertDesktop]').prop('checked', true);      }
    if (scout.globalSettings.messageInApp)      { $('[data-argName=messageInApp]').prop('checked', true);      }
    if (scout.globalSettings.messageSound)      { $('[data-argName=messageSound]').prop('checked', true);      }
    if (scout.globalSettings.messageDesktop)    { $('[data-argName=messageDesktop]').prop('checked', true);    }
    if (scout.globalSettings.sendToTrayOnClose) { $('[data-argName=sendToTrayOnClose]').prop('checked', true); }
    if (scout.globalSettings.startMinimized)    { $('[data-argName=startMinimized]').prop('checked', true);    }
    if (scout.globalSettings.automaticUpdates)  { $('[data-argName=automaticUpdates]').prop('checked', true);  }

    for (var i = 0; i < $('#cultureChoices option').length; i++) {
        if ($($('#cultureChoices option')[i]).val() == scout.globalSettings.cultureCode) {
            $($('#cultureChoices option')[i]).prop('selected', true);
        }
    }

    var atomicSlider = new Slider('#atomicSlider', {
        min: 0,
        max: 700,
        step: 100,
        ticks: [0, 100, 200, 300, 400, 500, 600, 700],
        value: scout.globalSettings.atomicSlider || 100,
        formatter: function (value) {
            return value + ' ' + scout.localize('MILLISECONDS_SHORT');
        }
    });

    atomicSlider.on('change', function (data) {
        scout.globalSettings.atomicSlider = data.newValue;
    });

    $('#cultureChoices').change(function () {
        var lang = $('#cultureChoices').val();
        scout.helpers.setLanguage(lang);
        $('#culture-pics img').addClass('hide');
        $('#culture-pics .' + lang).removeClass('hide');
        $('#translators a').addClass('hide');
        $('#translators .' + lang).removeClass('hide');
        scout.helpers.updateSidebar();
        scout.helpers.ftux();
    });

    function checkboxChanged () {
        ugui.helpers.buildUGUIArgObject();
        scout.globalSettings.alertDesktop      = ugui.args.alertDesktop.htmlticked;
        scout.globalSettings.alertInApp        = ugui.args.alertInApp.htmlticked;
        scout.globalSettings.alertSound        = ugui.args.alertSound.htmlticked;
        scout.globalSettings.messageDesktop    = ugui.args.messageDesktop.htmlticked;
        scout.globalSettings.messageInApp      = ugui.args.messageInApp.htmlticked;
        scout.globalSettings.messageSound      = ugui.args.messageSound.htmlticked;
        scout.globalSettings.sendToTrayOnClose = ugui.args.sendToTrayOnClose.htmlticked;
        scout.globalSettings.startMinimized    = ugui.args.startMinimized.htmlticked;
        scout.globalSettings.automaticUpdates  = ugui.args.automaticUpdates.htmlticked;
    }

    $('#preferences-modal input[type="checkbox"]').change(checkboxChanged);
    $('[data-argName=sendToTrayOnClose], [data-argName=startMinimized], [data-argName=automaticUpdates]').change(function () {
        // Because people will be toying around with the sendToTrayOnClose/startMinimized,
        // we should save this on each change instead of on modal close only
        checkboxChanged();
        scout.helpers.saveSettings();
    });

    // Show the correct cultural image and translator
    $('#culture-pics .' + scout.globalSettings.cultureCode).removeClass('hide');
    $('#translators .' + scout.globalSettings.cultureCode).removeClass('hide');

})(window.$, window.scout, window.ugui, window.Slider);
