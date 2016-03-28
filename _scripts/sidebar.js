
/*
  Controls for the sidebar
*/

(function(){

    function updateSidebar () {
        $("#projects-list").empty();

        //Create list of projects in sidebar
        for (var i = 0; i < scout.projects.length; i++) {
            var currentProject = scout.projects[i];
            var standardProject =
              '<div class="btn btn-default truncate ' + currentProject.projectID + '" data-id="' + currentProject.projectID + '">' +
                '<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>' +
                currentProject.projectName +
                '<span class="btn btn-info">' +
                  '<span class="glyphicon glyphicon-play"></span>' +
                '</span>' +
              '</div>';
            $("#projects-list").append(standardProject);
        }

        //Register click events for sidebar buttons
        $("#projects-list div").click(function (evt) {
            $("#sidebar .active").removeClass('active');
            $(evt.currentTarget).addClass('active');
            var id = $(evt.currentTarget).data('id');
            for (var j = 0; j < scout.projects.length; j++) {
                if (id == scout.projects[j].projectID) {
                    scout.helpers.updateProjectSettingsView(scout.projects[j]);
                }
            }
        });

    }

    //Run once on start
    updateSidebar();
    scout.helpers.updateSidebar = updateSidebar;

})();
