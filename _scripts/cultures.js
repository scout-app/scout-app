
/*
  Localization, Internationalization, language files
  Set the correct language. Read the language file.
  Update scout.dictionary.
*/

(function(){

    /**
     * This is the basic KEY to Definition function for languages.
     *
     * @param  {string}  phrase         The KEYWORD for the dictionary to match
     * @param  {boolean} wrapInDataLang If false, we don't wrap the string in a data-lang span
     * @return {string}                 The translated text.
     */
    function localize (phrase, wrapInDataLang) {
        wrapInDataLang = wrapInDataLang || false;
        if (!phrase) {
            return "No translation found.";
        }
        var translation = window.dictionary[phrase];

        if (wrapInDataLang) {
            return '<span data-lang="' + phrase + '">' + translation + '</span>';
        } else {
            return translation;
        }
    }

    /**
     * There are HTML elements that include a data-lang="KEYWORD" attribute.
     * This function updates them with the matching translation to their KEYWORD.
     */
    function updateDataLangs () {
        var items = $("*[data-lang]");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var langKey = $(item).data("lang");
            $(item).html( localize(langKey) );
        }
    }

    /**
     * Allow users to update the language of the app to match their locale.
     * @param {sting} userLanguage  Should match a .json file in the cultures folder.
     */
    function setLanguage (userLanguage) {
        userLanguage = userLanguage || "en";
        scout.cultureCode = userLanguage;
        var dictionary = ugui.helpers.readAFile('cultures/' + userLanguage + '.json');
        dictionary = JSON.parse(dictionary);
        window.dictionary = dictionary;
        if (scout.helpers.saveSettings) {
            scout.helpers.saveSettings();
        }
        updateDataLangs();
    }

    //This will be overridden by the user's saved settings later,
    //but if they don't have saved settings, we default to English.
    setLanguage('en');
    updateDataLangs();
    scout.helpers.setLanguage = setLanguage;
    scout.helpers.updateDataLangs = updateDataLangs;
    scout.localize = localize;

})();
