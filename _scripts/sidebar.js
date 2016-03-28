
/*
  Controls for the sidebar
*/

(function(){

    function updateSidebar () {
        $("#projects-list").empty();

        for (var i = 0; i < scout.projects.length; i++) {
            var currentProject = scout.projects[i];
            var standardProject =
              '<div class="btn btn-default truncate ' + currentProject.projectID + '">' +
                '<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>' +
                currentProject.projectName +
                '<span class="btn btn-info">' +
                  '<span class="glyphicon glyphicon-play"></span>' +
                '</span>' +
              '</div>';
            $("#projects-list").append(standardProject);
        }
    }

    //Run once on start
    updateSidebar();
    scout.helpers.updateSidebar = updateSidebar;

})();
