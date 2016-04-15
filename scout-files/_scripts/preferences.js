
/*
  App-wide preference controls. Language settings, Theme ,etc.
*/

(function(){

    $("#preferences").click(function () {
        $("#preferences-modal").fadeIn();
    });

    for (var i = 0; i < $("#cultureChoices option").length; i++) {
        if ( $($("#cultureChoices option")[i]).val() == scout.cultureCode ) {
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

    //Show the correct cultural image and translator
    $("#culture-pics ." + scout.cultureCode).removeClass("hide");
    $("#translators ." + scout.cultureCode).removeClass("hide");

})();
