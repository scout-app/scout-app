
/*
  Localization, Internationalization, language files
  Set the correct language. Read the language file.
  Update scout.dictionary.
*/

(function(){

    function setLanguage (userLanguage) {
        userLanguage = userLanguage || "en";
        scout.cultureCode = userLanguage;
        var dictionary = ugui.helpers.readAFile('cultures/' + userLanguage + '.json');
        dictionary = JSON.parse(dictionary);
        window.dictionary = dictionary;
        if (scout.helpers.saveSettings) {
            scout.helpers.saveSettings();
        }
    }

    function localize (phrase) {
        return window.dictionary[phrase];
    }

    function updateDataLangs () {
        var items = $("*[data-lang]");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var langKey = $(item).data("lang");
            $(item).html( localize(langKey) );
        }
    }

    //This will be overridden by the user's saved settings later,
    //but if they don't have saved settings, we default to English.
    setLanguage('en');
    updateDataLangs();
    scout.helpers.setLanguage = setLanguage;
    scout.localize = localize;

})();
