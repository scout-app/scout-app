
/*
  Controls for the sidebar
*/

(function(){

    function updateSidebar () {
        $("#projects-list").empty();

        //Create list of projects in sidebar
        for (var i = 0; i < scout.projects.length; i++) {
            var currentProject = scout.projects[i];
            var indicatorColor = "btn-info";
            var indicatorStatus = "glyphicon-play";

            if (currentProject.indicator == "stop") {
                indicatorColor = "btn-wdanger"
                indicatorStatus = "glyphicon-stop";
            } else if (currentProject.indicator == "play") {
                indicatorColor = "btn-info";
                indicatorStatus = "glyphicon-play";
            }

            var standardProject =
              '<div class="btn btn-default truncate ' + currentProject.projectID + '" data-id="' + currentProject.projectID + '">' +
                '<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>' +
                currentProject.projectName +
                '<button class="btn ' + indicatorColor + '">' +
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
            var currentlyViewedProject = $("#projectID").val();
            if (currentlyViewedProject !== id) {
                for (var j = 0; j < scout.projects.length; j++) {
                    if (id == scout.projects[j].projectID) {
                        scout.helpers.updateProjectSettingsView(scout.projects[j]);
                    }
                }
            }
        });

        $("#projects-list .glyphicon-play").click(function (evt) {
            evt.stopPropagation();
            var id = $(evt.currentTarget).parent().parent().data("id");
            for (var i = 0; i < scout.projects.length; i++) {
                if (scout.projects[i].projectID == id) {
                    //Send the folder path to be processed
                    var inputFolder = scout.projects[i].inputFolder;
                    scout.helpers.processInputFolder(inputFolder);
                    //monitor inputFolder for changes
                    scout.helpers.startWatching(inputFolder);
                    scout.projects[i].indicator = "stop";
                }
            }
            updateSidebar();
        });

        $("#projects-list .glyphicon-stop").click(function (evt) {
            evt.stopPropagation();
            var id = $(evt.currentTarget).parent().parent().data("id");
            for (var i = 0; i < scout.projects.length; i++) {
                if (scout.projects[i].projectID == id) {
                    //Send the folder path to be processed
                    //var inputFolder = scout.projects[i].inputFolder;
                    //scout.helpers.processInputFolder(inputFolder);
                    //monitor inputFolder for changes
                    //scout.helpers.startWatching(inputFolder);
                    //Update icon and color in sidebar
                    scout.projects[i].indicator = "play";
                }
            }
            updateSidebar();
        });

    }

    //Run once on start
    updateSidebar();
    scout.helpers.updateSidebar = updateSidebar;

})();
