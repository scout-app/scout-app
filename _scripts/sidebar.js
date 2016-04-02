
/*
  Controls for the sidebar
*/

(function(){

    function updateSidebar () {
        $("#projects-list").empty();

        var indicatorColor = "";
        var indicatorStatus = "";
        var indicatorDisable = "";
        //Create list of projects in sidebar
        for (var i = 0; i < scout.projects.length; i++) {
            var id = scout.projects[i].projectID;
            indicatorColor = "btn-info";
            indicatorStatus = "glyphicon-play";
            indicatorDisable = "";

            if (scout.projects[i].indicator == "stop") {
                indicatorColor = "btn-danger";
                indicatorStatus = "glyphicon-stop";
            } else if (scout.projects[i].indicator == "gray-play") {
                indicatorColor = "btn-info gray";
                indicatorDisable = "disable";
            }

            var standardProject =
              '<div class="btn btn-default truncate ' + id + '" data-id="' + id + '">' +
                '<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>' +
                scout.projects[i].projectName +
                '<button class="btn ' + indicatorColor + '" ' + indicatorDisable + '>' +
                  '<span class="glyphicon ' + indicatorStatus + '"></span>' +
                '</button>' +
              '</div>';

            $("#projects-list").append(standardProject);
        }

        //Register click events for sidebar buttons
        $("#projects-list div").click(function (evt) {
            evt.stopPropagation();
            $("#sidebar .active").removeClass('active');
            $(evt.currentTarget).addClass('active');
            var id = $(evt.currentTarget).data('id');
            //If the thing you clicked on is already on display, do nothing
            //var currentlyViewedProject = $("#projectID").val();
            //if (currentlyViewedProject !== id) {
                for (var j = 0; j < scout.projects.length; j++) {
                    if (id == scout.projects[j].projectID) {
                        scout.helpers.updateProjectSettingsView(scout.projects[j]);
                    }
                }
            //}
        });

        $("#projects-list .btn .btn").click(function (evt) {
            evt.stopPropagation();
            //Make sure the button isn't disabled
            if (!$(evt.currentTarget).hasClass('gray')) {
                var id = $(evt.currentTarget).parent().data("id");
                for (var i = 0; i < scout.projects.length; i++) {
                    if (scout.projects[i].projectID == id) {

                        if ($(evt.currentTarget).find('.glyphicon').hasClass('glyphicon-stop')) {
                            //Update icon and color in sidebar
                            scout.projects[i].indicator = "play";
                            //Stop watching the files for changes
                            if (scout.projects[i].watcher) {
                                scout.projects[i].watcher.close();
                            }
                        } else {
                            scout.helpers.processInputFolder(scout.projects[i]);
                            //monitor inputFolder for changes
                            scout.helpers.startWatching(scout.projects[i]);
                            scout.projects[i].indicator = "stop";
                        }

                    }
                }
                scout.helpers.updateSidebar();
            }
        });
    }

    //Run once on start
    scout.helpers.updateSidebar = updateSidebar;

})();
