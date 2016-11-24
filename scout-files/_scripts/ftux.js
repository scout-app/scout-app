
/*
  FTUX: First Time User Experience
  This is to help with the empty state of the app on first use
  or when you just have 0 projects.
*/

(function ($, scout, ugui) {

    // Show FTUX view | Hide Sidebar | Hide Project Settings
    function loadFTUX () {
        var width = $('#sidebar').css('width');
        //Hide everything!
        $('#sidebar').css('left', '-' + width);
        $('#project-settings, #printConsoleTitle, #printConsole .alert, #printConsole .panel').fadeOut();
        $('#viewStatusNav').addClass('hide');
        //Show FTUX
        $('#ftux').fadeIn('slow');
    }

    // Hide FTUX view | Show Sidebar | Show Project Settings
    function unloadFTUX () {
        //Hide FTUX
        $('#ftux').fadeOut();
        //Show everything!
        $('#sidebar').css('left', '0px');
        $('#project-settings, #printConsoleTitle, #printConsole .alert, #printConsole .panel').fadeIn();
        $('#viewStatusNav').removeClass('hide');
    }

    function ftuxEvents () {
    }

    //The main FTUX function
    function ftux () {
        if (scout.projects.length < 1 && ugui.app.argv.length < 1) {
            loadFTUX();
            ftuxEvents();
        } else {
            unloadFTUX();
        }
    }

    //run once
    ftux();
    scout.helpers.ftux = ftux;

})(window.$, window.scout, window.ugui);
