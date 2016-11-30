
/*
  FTUX: First Time User Experience
  This is to help with the empty state of the app on first use
  or when you just have 0 projects.
*/

(function ($, scout, ugui, CountUp) {

    // Show FTUX view | Hide Sidebar | Hide Project Settings
    function loadFTUX () {
        var width = $('#sidebar').css('width');
        // Hide everything!
        $('#sidebar').css('left', '-' + width);
        $('#project-settings, #printConsoleTitle, #printConsole .alert, #printConsole .panel').fadeOut();
        $('#viewStatusNav').addClass('hide');
        // Show FTUX
        $('#ftux').fadeIn('slow');
    }

    // Hide FTUX view | Show Sidebar | Show Project Settings
    function unloadFTUX () {
        // Hide FTUX
        $('#ftux').fadeOut();
        // Show everything!
        $('#sidebar').css('left', '0px');
        $('#project-settings, #printConsoleTitle, #printConsole .alert, #printConsole .panel').fadeIn();
        $('#viewStatusNav').removeClass('hide');
    }

    function updateProjectsFoundCount () {
        var text = '';
        var projectsFound = scout.ftux.projectsFound;
        if (projectsFound && projectsFound > 0) {
            text = 'found {{0}} projects'; // LOCALIZE
            text = text.replace('{{0}}', '<strong id="countUp">0</strong>');
            $('#ftux-multi-text').html(text);

            var start = 0;
            var end = scout.ftux.projectsFound;
            var decimal = 0;
            var duration = 2.5;
            var options = {
                'useEasing': true,
                'useGrouping': true,
                'separator': ',',
                'decimal': '.',
                'prefix': '',
                'suffix': ''
            };
            var count = new CountUp('countUp', start, end, decimal, duration, options);
            count.start();
        } else {
            text = 'select the group folder'; // LOCALIZE
            $('#ftux-multi-text').html(text);
        }
    }

    // The main FTUX function
    function ftux () {
        if (scout.projects.length < 1 && ugui.app.argv.length < 1) {
            loadFTUX();
            scout.helpers.autoGuessProjectsFolder(updateProjectsFoundCount);
        } else {
            unloadFTUX();
        }
    }

    // run once
    ftux();
    scout.helpers.ftux = ftux;

})(window.$, window.scout, window.ugui, window.CountUp);
