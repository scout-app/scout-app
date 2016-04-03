
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

    setLanguage();
    scout.helpers.setLanguage = setLanguage;
    scout.localize = localize;

})();
