
/*
  App-wide preference controls. Language settings, Theme ,etc.
*/

(function(){

    $("#preferences").click(function () {
        $("#preferences-modal").fadeIn();
    });

    for (var i = 0; i < $("#cultureChoices option").length; i++) {
        if ( $($("#cultureChoices option")[i]).val() == scout.globalSettings.cultureCode ) {
            $( $("#cultureChoices option")[i] ).prop("selected", true);
        }
    }

    $("#cultureChoices").change(function () {
        var lang = $("#cultureChoices").val();
        scout.helpers.setLanguage(lang);
        $("#culture-pics img").addClass("hide");
        $("#culture-pics ." + lang).removeClass("hide");
        $("#translators a").addClass("hide");
        $("#translators ." + lang).removeClass("hide");
        scout.helpers.updateSidebar();
        scout.helpers.ftux();
    });

    function checkboxChanged () {
        ugui.helpers.buildUGUIArgObject();
        //scout.globalSettings.alertDesktop   = ugui.args.alertDesktop.htmlticked;
        //scout.globalSettings.messageDesktop = ugui.args.messageDesktop.htmlticked;
        scout.globalSettings.alertInApp       = ugui.args.alertInApp.htmlticked;
        scout.globalSettings.alertSound       = ugui.args.alertSound.htmlticked;
        scout.globalSettings.messageInApp     = ugui.args.messageInApp.htmlticked;
        scout.globalSettings.messageSound     = ugui.args.messageSound.htmlticked;
        console.table(scout.globalSettings);
    }

    $('#preferences-modal input[type="checkbox"]').change(checkboxChanged);

    //Show the correct cultural image and translator
    $("#culture-pics ." + scout.globalSettings.cultureCode).removeClass("hide");
    $("#translators ." + scout.globalSettings.cultureCode).removeClass("hide");

})();
