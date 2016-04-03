
/*
  Localization, Internationalization, language files
*/

(function(){

    function setLanguage (userLanguage) {
        userLanguage = userLanguage || "en";
        scout.cultureCode = userLanguage;
        var dictionary = ugui.helpers.readAFile('cultures/' + userLanguage + '.json');
        dictionary = JSON.parse(dictionary);
        scout.dictionary = dictionary;
    }

    function localize (phrase) {
        return scout.dictionary[phrase];
    }

    function updateDataLangs () {
        var items = $("*[data-lang]");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var langKey = $(item).data("lang");
            $(item).html( localize(langKey) );
        }
    }

    setLanguage();
    updateDataLangs();
    scout.helpers.setLanguage = setLanguage;
    scout.localize = localize;

})();
