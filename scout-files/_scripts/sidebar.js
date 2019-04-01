
/*
  Controls for the sidebar, its icons, and click events.
*/

(function ($, scout) {

    function updateSidebar () {
        $('#projects-list').empty();

        var indicatorColor = '';
        var indicatorStatus = '';
        var indicatorDisable = '';
        var title = '';
        // Create list of projects in sidebar
        for (var i = 0; i < scout.projects.length; i++) {
            var id = scout.projects[i].projectID;
            indicatorColor = 'btn-info';
            indicatorStatus = 'glyphicon-play';
            indicatorDisable = '';
            title = '';

            if (scout.projects[i].indicator == 'stop') {
                indicatorColor = 'btn-danger';
                indicatorStatus = 'glyphicon-stop';
            } else if (scout.projects[i].indicator == 'gray-play') {
                indicatorColor = 'btn-info gray';
                indicatorStatus = 'glyphicon-question-sign';
                indicatorDisable = 'disable';
                title = scout.localize('MISSING_DATA');
            }

            var standardProject =
              '<div class="btn btn-default truncate ' + id + '" data-id="' + id + '" title="' + title + '">' +
                '<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>' +
                '<span class="name truncate">' + scout.projects[i].projectName + '</span>' +
                '<button class="btn ' + indicatorColor + '" ' + indicatorDisable + '>' +
                  '<span class="glyphicon ' + indicatorStatus + '"></span>' +
                '</button>' +
              '</div>';

            $('#projects-list').append(standardProject);
        }

        // Register click events for sidebar buttons
        $('#projects-list div').click(function (evt) {
            evt.stopPropagation();
            $('#sidebar .active').removeClass('active');
            $(evt.currentTarget).addClass('active');
            var id = $(evt.currentTarget).data('id');
            for (var j = 0; j < scout.projects.length; j++) {
                if (id == scout.projects[j].projectID) {
                    scout.helpers.updateProjectSettingsView(scout.projects[j]);
                }
            }
        });

        // Clicking the play/stop button
        $('#projects-list .btn .btn').click(function (evt) {
            evt.stopPropagation();
            // Make sure the button isn't disabled
            if (!$(evt.currentTarget).hasClass('gray')) {
                var id = $(evt.currentTarget).parent().data('id');
                //
                if ($(evt.currentTarget).children().hasClass('glyphicon-stop')) {
                    scout.helpers.stopWatching(id);
                } else if ($(evt.currentTarget).children().hasClass('glyphicon-play')) {
                    scout.helpers.startWatching(id);
                }
            }
        });

        // Drag and Drop sorting
        $('#projects-list').sortable({
            axis: 'y',
            placeholder: 'btn btn-info',
            start: function (evt, ui) { // eslint-disable-line no-unused-vars
                scout.sort = {};
                scout.sort.start = ui.item.index();
            },
            stop: function (evt, ui) { // eslint-disable-line no-unused-vars
                scout.sort.end = ui.item.index();
                scout.projects.move(scout.sort.start, scout.sort.end);
                scout.helpers.saveSettings();
            }
        }).disableSelection();

        function rightClickDeleteMenu () {
            function Menu () {
                var gui = require('nw.gui');
                var menu = new gui.Menu();
                var removeProject = scout.localize('DELETE_PROJECT');

                var deleteProject = new gui.MenuItem({
                    label: removeProject,
                    click: function () {
                        $('#delete-project').click();
                    }
                });

                menu.append(deleteProject);

                return menu;
            }

            var menu = new Menu();

            $('#projects-list > .btn').on('contextmenu', function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                $(this).click();
                menu.popup(evt.originalEvent.x, evt.originalEvent.y);
            });
        }

        // Run once on page load
        rightClickDeleteMenu();
    }

    // Empties the sidebar of projects
    // loops through the scout.projects object to recreate the sidebar
    scout.helpers.updateSidebar = updateSidebar;

})(window.$, window.scout);
